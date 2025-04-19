import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { DrizzleModule } from '@app/common/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { CachingModule } from '@app/common/caching/caching.module';

@Module({
  imports: [DrizzleModule, AuthModule, CachingModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
