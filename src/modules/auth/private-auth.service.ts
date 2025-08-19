import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../private/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { JwtUserPayload } from 'src/common/constants/payload';

@Injectable()
export class PrivateAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.userService.validatePassword(
      password,
      user.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtUserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      kind: 'user',
      ver: 1,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
