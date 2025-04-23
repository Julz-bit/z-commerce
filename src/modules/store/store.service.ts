import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { store } from '@app/common/drizzle/schema';
import { createId } from '@paralleldrive/cuid2';
import { StoreModel } from '@app/common/drizzle/models.type';
import { eq } from 'drizzle-orm';
import { CachingService } from '@app/common/caching/caching.service';
import { CacheKeys } from '@app/common/enums/cache-keys';

@Injectable()
export class StoreService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly cache: CachingService,
  ) {}

  async create(dto: CreateStoreDto, ownerId: string): Promise<StoreModel> {
    return await this.drizzle.client
      .insert(store)
      .values({
        id: createId(),
        ownerId,
        ...dto,
      })
      .returning()
      .then((rows) => rows[0]);
  }

  async findOne(id: string): Promise<StoreModel> {
    const cacheKey = `${CacheKeys.STORE}:${id}`;
    const cachedResult = await this.cache.get<StoreModel>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const result = await this.drizzle.client.query.store.findFirst({
      where: eq(store.id, id),
    });
    if (!result) {
      throw new NotFoundException('store not found!');
    }
    await this.cache.set<StoreModel>(cacheKey, result);
    return result;
  }

  async update(id: string, dto: UpdateStoreDto): Promise<StoreModel> {
    const result = await this.drizzle.client
      .update(store)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(store.id, id))
      .returning()
      .then((rows) => rows[0]);
    await this.cache.del(`${CacheKeys.STORE}:${id}`);
    return result;
  }
}
