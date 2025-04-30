import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { S3ClientProvider } from '../providers/s3-client.provider';

@Module({
  providers: [FileService, S3ClientProvider],
  exports: [FileService],
})
export class FileModule {}
