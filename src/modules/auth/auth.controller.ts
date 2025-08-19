// auth.controller.ts
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PublicAuthService } from './public-auth.service';
import { PrivateAuthService } from './private-auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly publicAuth: PublicAuthService,
    private readonly privateAuth: PrivateAuthService,
  ) {}

  @Post('public/login')
  publicLogin(@Body(ValidationPipe) dto: LoginDto) {
    return this.publicAuth.login(dto);
  }

  @Post('private/login')
  privateLogin(@Body(ValidationPipe) dto: LoginDto) {
    return this.privateAuth.login(dto);
  }
}
