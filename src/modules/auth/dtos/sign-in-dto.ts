import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'julzcaraan101@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'asdqwe123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
