import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { product, productVariant } from '@app/common/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { ProductModel } from '@app/common/drizzle/models.type';
import { CachingService } from '@app/common/caching/caching.service';
import { PaginationProductDto } from './dto/pagination-product.dto';
import { SortOrder } from '@app/common/enums/sort-order.enum';
import { CacheKeys } from '@app/common/enums/cache-keys';
import { toLowerAndRemoveSpace } from '@app/utils/format-str';
import { extractIndexes } from '@app/utils/extract-number';
import { and, asc, desc, eq, gt, ilike, lt, or } from 'drizzle-orm';
import { paginationResult } from '@app/utils/pagination';
import { PaginatedResult } from '@app/common/interfaces/paginated-result';
import { VariantDto } from './dto/variant.dto';
import { File } from '@nest-lab/fastify-multer';
import { FileService } from '@app/common/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly cache: CachingService,
    private readonly file: FileService,
  ) {}

  async create(storeId: string, dto: CreateProductDto): Promise<ProductModel> {
    const result = await this.drizzle.client
      .insert(product)
      .values({
        id: createId(),
        categoriesFlat: dto.categories.join(' '),
        storeId,
        ...dto,
      })
      .returning()
      .then((rows) => rows[0]);
    await this.cache.invalidate(CacheKeys.PRODUCT);
    return result;
  }

  async findByStore(
    storeId: string,
    query: PaginationProductDto,
  ): Promise<PaginatedResult<ProductModel>> {
    const { order = SortOrder.ASC, limit, cursor, search } = query;
    const cacheKey = `${CacheKeys.PRODUCT}:store:${storeId}:${order}:${limit}:${cursor ?? 'cursor'}:${toLowerAndRemoveSpace(search)}`;
    const cachedResult =
      await this.cache.get<PaginatedResult<ProductModel>>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const data = await this.drizzle.client.query.product.findMany({
      where: and(
        eq(product.storeId, storeId),
        cursor
          ? order === SortOrder.ASC
            ? gt(product.cursor, cursor)
            : lt(product.cursor, cursor)
          : undefined,
        search
          ? or(
              ilike(product.name, `%${search}%`),
              ilike(product.categoriesFlat, `%${search}%`),
            )
          : undefined,
      ),
      limit: limit + 1,
      with: {
        variants: true,
      },
      orderBy:
        order === SortOrder.ASC ? asc(product.cursor) : desc(product.cursor),
    });
    const result = paginationResult(data, limit, order, cursor);
    await this.cache.set<PaginatedResult<ProductModel>>(cacheKey, result);
    return result;
  }

  findAll() {
    return `This action returns all product`;
  }

  async findOne(id: string) {
    const cacheKey = `${CacheKeys.PRODUCT}:${id}`;
    const cachedResult = await this.cache.get<ProductModel>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const result = await this.drizzle.client.query.product.findFirst({
      where: eq(product.id, id),
    });
    if (!result) {
      throw new NotFoundException('product not found');
    }
    await this.cache.set<ProductModel>(cacheKey, result);
    return result;
  }

  async createVariants(
    productId: string,
    storeId: string,
    dto: VariantDto[],
    files: File[],
  ): Promise<{ count: number }> {
    const product = await this.findOne(productId);
    const variants = dto.map((item) => ({
      ...item,
      id: createId(),
      productId: product.id,
      price: item.price.toString(),
      updatedAt: new Date(),
      files: [] as string[],
    }));
    const key = `media/${storeId}`;
    const fileKeys = await this.file.uploadFiles(key, files);
    for (const uploaded of fileKeys) {
      const index = extractIndexes(uploaded.fieldname);
      if (index[0] !== null && variants[index[0]]) {
        variants[index[0]].files.push(uploaded.key);
      }
    }
    const result = await this.drizzle.client
      .insert(productVariant)
      .values(variants)
      .returning();
    await this.cache.invalidate(CacheKeys.PRODUCT);
    return {
      count: result.length,
    };
  }
}
