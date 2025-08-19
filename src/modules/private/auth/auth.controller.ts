import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('private/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('test') // Add this temporarily
  test() {
    return { message: 'Auth routes are working!' };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginData: LoginDto) {
    return this.authService.login(loginData);
  }
}
