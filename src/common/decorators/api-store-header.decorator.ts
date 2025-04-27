import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiStoreHeader() {
  return applyDecorators(
    ApiHeader({
      name: 'x-store-id',
      description: 'Store id for authorization',
      example: 'uj1ld7v9p2hgy8k3pbfg2a8c',
      required: true,
    }),
  );
}
