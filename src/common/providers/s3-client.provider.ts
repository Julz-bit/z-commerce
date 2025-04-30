import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const S3_CLIENT = 'S3_CLIENT';

export const S3ClientProvider = {
  provide: 'S3_CLIENT',
  useFactory: (config: ConfigService) => {
    // Use Localstack default for dev env
    const isDev = config.get('NODE_ENV') === 'development';
    return new S3Client({
      region: config.get('AWS_DEFAULT_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID', 'test'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY', 'test'),
      },
      ...(isDev && {
        endpoint: config.get('AWS_S3_ENDPOINT', 'http://localstack:4566'),
        forcePathStyle: true,
      }),
    });
  },
  inject: [ConfigService],
};
