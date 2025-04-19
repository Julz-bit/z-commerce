import { SortOrder } from '@app/common/enums/sort-order.enum';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, MinLength } from 'class-validator';

export class QueryCategoryDto {
  @IsEnum(SortOrder, { message: 'Order must be either asc or desc' })
  order: SortOrder;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsPositive({ message: 'limit must be a valid number' })
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'cursor must be a valid number' })
  cursor?: number;

  @IsOptional()
  @MinLength(3, { message: 'search must be at least 3 characters long' })
  search?: string;
}
