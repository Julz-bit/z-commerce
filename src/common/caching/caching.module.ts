import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisProvider } from '../providers/redis-provider';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL')!;
        return {
          stores: [createKeyv(redisUrl)],
          ttl: +config.get('CACHE_TTL'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CachingService, RedisProvider],
  exports: [CachingService],
})
export class CachingModule {}
