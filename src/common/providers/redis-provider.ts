import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (config: ConfigService) => {
    return new Redis(config.get<string>('REDIS_URL')!);
  },
  inject: [ConfigService],
};
