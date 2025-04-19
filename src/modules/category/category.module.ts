import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DrizzleModule } from '@app/common/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { CachingModule } from '@app/common/caching/caching.module';

@Module({
  imports: [DrizzleModule, AuthModule, CachingModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
