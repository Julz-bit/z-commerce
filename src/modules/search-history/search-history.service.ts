import { CachingService } from '@app/common/caching/caching.service';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { SearchHistoryModel } from '@app/common/drizzle/models.type';
import { searchHistory } from '@app/common/drizzle/schema';
import { CacheKeys } from '@app/common/enums/cache-keys';
import { Injectable, NotFoundException } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class SearchHistoryService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly cache: CachingService,
  ) {}

  async create(userId: string, keyword: string): Promise<SearchHistoryModel> {
    const result = await this.drizzle.client
      .insert(searchHistory)
      .values({
        id: createId(),
        userId,
        keyword,
      })
      .returning()
      .then((rows) => rows[0]);
    await this.cache.del(`${CacheKeys.SEARCH_HISTORY}:user:${userId}`);
    return result;
  }

  async findLatest(userId: string): Promise<SearchHistoryModel[]> {
    const cacheKey = `${CacheKeys.SEARCH_HISTORY}:user:${userId}`;
    const cachedResult = await this.cache.get<SearchHistoryModel[]>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const result = await this.drizzle.client.query.searchHistory.findMany({
      where: eq(searchHistory.userId, userId),
      orderBy: [desc(searchHistory.cursor)],
      limit: 5,
    });
    await this.cache.set<SearchHistoryModel[]>(cacheKey, result);
    return result;
  }

  async findOne(userId: string, id: string): Promise<SearchHistoryModel> {
    const cacheKey = `${CacheKeys.CATEGORY}:user:${userId}:${id}`;
    const cachedResult = await this.cache.get<SearchHistoryModel>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const result = await this.drizzle.client.query.searchHistory.findFirst({
      where: eq(searchHistory.id, id),
    });

    if (!result) {
      throw new NotFoundException('search history not found!');
    }
    await this.cache.set<SearchHistoryModel>(cacheKey, result);
    return result;
  }

  async remove(userId: string, id: string): Promise<SearchHistoryModel> {
    await this.findOne(userId, id);
    const result = await this.drizzle.client
      .delete(searchHistory)
      .where(eq(searchHistory.id, id))
      .returning()
      .then((rows) => rows[0]);
    await this.cache.del(`${CacheKeys.SEARCH_HISTORY}:user:${userId}`);
    return result;
  }
}
