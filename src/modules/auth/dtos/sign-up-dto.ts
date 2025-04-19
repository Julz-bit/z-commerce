import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsPasswordMatch } from '../decorators/is-password-match.decorator';

export class SignUpDto {
  @ApiProperty({ example: 'julzcaraan101@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'asdqwe123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'asdqwe123' })
  @IsNotEmpty({ message: 'password confirmation should not be empty' })
  @IsString()
  @IsPasswordMatch()
  passwordConfirmation: string;

  @ApiProperty({ example: 'Julz Caraan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '09634514567' })
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'CASA CALUMALA' })
  @IsOptional()
  addressLine?: string;

  @ApiProperty({ example: 'Calumala' })
  @IsNotEmpty()
  barangay: string;

  @ApiProperty({ example: 'Sta. Teresita' })
  @IsNotEmpty()
  cityMunicipality: string;

  @ApiProperty({ example: 'Batangas' })
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: 4206 })
  @IsNumber()
  postalCode: number;

  @ApiProperty({ example: 'PH' })
  @IsNotEmpty()
  country: string;
}
