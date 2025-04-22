import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SortOrder } from '../enums/sort-order.enum';

export function ApiPaginationQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'order',
      enum: SortOrder,
      required: true,
      example: SortOrder.ASC,
    }),
    ApiQuery({ name: 'limit', required: true, example: 20 }),
    ApiQuery({ name: 'cursor', required: false }),
    ApiQuery({ name: 'search', required: false }),
  );
}
