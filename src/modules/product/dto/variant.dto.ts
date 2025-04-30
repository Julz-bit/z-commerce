import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class VariantDto {
  @ApiProperty({ example: 'IPH17-BLK-512GB' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 100 })
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 70000 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: { color: 'Black', storage: '512GB' } })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
