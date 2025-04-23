import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Gadget' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @Transform(({ value }): string | undefined => {
    return value === '' || value == null ? undefined : value;
  })
  parentId?: string;
}
