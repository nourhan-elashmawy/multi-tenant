import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AdminService } from '../public/admin/admin.service';
import { TenantService } from '../public/tenant/tenant.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private tenantService: TenantService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.adminService.validatePassword(
      password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: payload,
    };
  }
}
