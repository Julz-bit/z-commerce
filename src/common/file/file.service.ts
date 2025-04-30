import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT } from '../providers/s3-client.provider';
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { File } from '@nest-lab/fastify-multer';
import { extname } from 'path';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class FileService {
  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly config: ConfigService,
  ) {}

  async uploadFiles(
    baseKey: string,
    files: File[],
  ): Promise<{ fieldname: string; key: string }[]> {
    await this.ensureBucketExists();

    const uploadPromises = files.map((file) => {
      const fileName = this.generateFileName(file);
      const key = `${baseKey}/${fileName}`;
      const metadata: Record<string, any> = {
        'x-meta-size': file.size?.toString(),
        'x-meta-fieldname': file.fieldname,
        'x-original-filename': file.originalname,
        'x-content-mimetype': file.mimetype,
      };
      return this.s3
        .send(
          new PutObjectCommand({
            Bucket: this.config.get<string>('AWS_BUCKET'),
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: metadata,
          }),
        )
        .then(() => ({
          fieldname: file.fieldname,
          key,
        }));
    });

    return Promise.all(uploadPromises);
  }

  private generateFileName(file: File): string {
    const uniqueName = createId();
    const ext = extname(file.originalname);
    return `${uniqueName}${ext}`;
  }

  async ensureBucketExists(): Promise<void> {
    const bucket = this.config.get<string>('AWS_BUCKET');
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.$metadata?.httpStatusCode === 404) {
        await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
      } else {
        throw err;
      }
    }
  }
}
