import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/sign-up-dto';

@ApiTags('Auth Service')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Login via email and password' })
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Create an account' })
  async singUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }
}
