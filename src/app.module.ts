import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './common/drizzle/drizzle.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';
import { CachingModule } from './common/caching/caching.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { FileModule } from './common/file/file.module';
import { SearchHistoryModule } from './modules/search-history/search-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    UserModule,
    AuthModule,
    StoreModule,
    CachingModule,
    CategoryModule,
    ProductModule,
    FileModule,
    SearchHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
