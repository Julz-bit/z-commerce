import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    example: `Store-${Math.random().toString(36).substring(2, 8)}`,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Lorem Ipsum' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '09634514567' })
  @IsOptional()
  contactNumber?: string;
}
