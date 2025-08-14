import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async register(registerData: CreateUserDto) {
    const userExists = await this.userService.findByEmail(registerData.email);
    if (userExists) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.userService.create(registerData);

    // return token -->  immediate login
    return this.login({
      email: user.email,
      password: registerData.password,
    });
  }
}
