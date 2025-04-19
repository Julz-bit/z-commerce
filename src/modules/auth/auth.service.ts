import { UserService } from '@app/modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in-dto';
import { JwtService } from '@nestjs/jwt';
import { BrcyptHelper } from '@app/common/helpers/bcrypt';
import { SignUpDto } from './dtos/sign-up-dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await BrcyptHelper.compare(dto.password, user.password))) {
      throw new NotFoundException('invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, ...rest } = user;
    const payload = { sub: id, ...rest };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(dto: SignUpDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, passwordConfirmation, ...rest } = dto;
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) {
      throw new BadRequestException('email already exists!');
    }
    const hashedPassword = await BrcyptHelper.hash(password);
    const user = await this.userService.create({
      ...rest,
      password: hashedPassword,
    });
    return user;
  }
}
