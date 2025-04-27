import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Iphone 17' })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'All new Iphone 17' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['Gadgets', 'Mobile Phone', 'Apple Products'] })
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
