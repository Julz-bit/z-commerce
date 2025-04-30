import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiVariantBody() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          variants: {
            type: 'string',
            description: 'Stringified JSON array of VariantDto[]',
            example: JSON.stringify(
              [
                {
                  sku: 'IPH17-BLK-512GB',
                  quantity: 1000,
                  price: 70000,
                  attributes: { color: 'black', size: '512GB' },
                },
              ],
              null,
              1,
            ),
          },
          'variants[0].files': {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}
