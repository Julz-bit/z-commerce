import { Module } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryController } from './search-history.controller';
import { DrizzleModule } from '@app/common/drizzle/drizzle.module';
import { CachingModule } from '@app/common/caching/caching.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DrizzleModule, AuthModule, CachingModule],
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService],
  exports: [SearchHistoryService],
})
export class SearchHistoryModule {}
