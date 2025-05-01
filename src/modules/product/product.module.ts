import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DrizzleModule } from '@app/common/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { CachingModule } from '@app/common/caching/caching.module';
import { StoreModule } from '../store/store.module';
import { FileModule } from '@app/common/file/file.module';
import { SearchHistoryModule } from '../search-history/search-history.module';

@Module({
  imports: [
    DrizzleModule,
    AuthModule,
    CachingModule,
    StoreModule,
    FileModule,
    SearchHistoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
