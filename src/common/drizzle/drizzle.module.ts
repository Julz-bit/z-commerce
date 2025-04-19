import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
