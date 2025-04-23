import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CachingService implements OnModuleDestroy {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  async get<T = any>(key: string): Promise<T | undefined> {
    const result = await this.cacheManager.get<T>(key);
    return result === null ? undefined : result;
  }

  async set<T = any>(key: string, data: T, ttl?: number): Promise<void> {
    await this.cacheManager.set<T>(key, data, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async invalidate(...patterns: string[]): Promise<void> {
    for (const pattern of patterns) {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          `${pattern}*`,
          'COUNT',
          100,
        );
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        cursor = nextCursor;
      } while (cursor !== '0');
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
