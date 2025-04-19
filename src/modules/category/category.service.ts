import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { CachingService } from '@app/common/caching/caching.service';
import { CategoryModel } from '@app/common/drizzle/models.type';
import { and, asc, desc, eq, gt, ilike, lt } from 'drizzle-orm';
import { category } from '@app/common/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { PaginatedResult } from '@app/common/interfaces/paginated-result';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CacheKeys } from '@app/common/enums/cache-keys';
import { toLowerAndRemoveSpace } from '@app/utils/format-str';
import { paginationResult } from '@app/utils/pagination';
import { SortOrder } from '@app/common/enums/sort-order.enum';

@Injectable()
export class CategoryService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly cache: CachingService,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryModel> {
    const exists = await this.drizzle.client.query.category.findFirst({
      where: eq(category.name, dto.name),
    });
    if (exists) {
      throw new BadRequestException(`${dto.name} already exists`);
    }
    const result = await this.drizzle.client
      .insert(category)
      .values({
        id: createId(),
        name: dto.name,
        ...(dto.parentId && { parentId: dto.parentId }),
      })
      .returning()
      .then((rows) => rows[0]);
    await this.cache.invalidate(CacheKeys.CATEGORY);
    return result;
  }

  async findAll(
    query: QueryCategoryDto,
  ): Promise<PaginatedResult<CategoryModel>> {
    const { order = SortOrder.ASC, limit, cursor, search } = query;
    const cacheKey = `${CacheKeys.CATEGORY}:${order}:${limit}:${cursor ?? 'cursor'}:${toLowerAndRemoveSpace(search)}`;
    const cachedResult =
      await this.cache.get<PaginatedResult<CategoryModel>>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const data = await this.drizzle.client
      .select()
      .from(category)
      .where(
        and(
          cursor
            ? order === SortOrder.ASC
              ? gt(category.cursor, cursor)
              : lt(category.cursor, cursor)
            : undefined,
          search ? ilike(category.name, `%${search}%`) : undefined,
        ),
      )
      .limit(limit + 1)
      .orderBy(
        order === SortOrder.ASC ? asc(category.cursor) : desc(category.cursor),
      );
    const result = paginationResult(data, limit, order, cursor);
    await this.cache.set<PaginatedResult<CategoryModel>>(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<CategoryModel> {
    const cacheKey = `${CacheKeys.CATEGORY}:${id}`;
    const result = await this.drizzle.client.query.category.findFirst({
      where: eq(category.id, id),
    });
    if (!result) {
      throw new NotFoundException('category not found!');
    }
    await this.cache.set<CategoryModel>(cacheKey, result);
    return result;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryModel> {
    const data = await this.findOne(id);
    const result = await this.drizzle.client
      .update(category)
      .set({
        name: dto.name,
        ...(dto.parentId && { parentId: dto.parentId }),
      })
      .where(eq(category.id, data.id))
      .returning()
      .then((rows) => rows[0]);
    await this.cache.invalidate(CacheKeys.CATEGORY);
    return result;
  }

  async remove(id: string): Promise<CategoryModel> {
    const data = await this.findOne(id);
    const result = await this.drizzle.client
      .delete(category)
      .where(eq(category.id, data.id))
      .returning()
      .then((rows) => rows[0]);
    await this.cache.invalidate(CacheKeys.CATEGORY);
    return result;
  }
}
