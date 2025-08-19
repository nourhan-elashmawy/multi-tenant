import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../public/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { JwtAdminPayload } from 'src/common/constants/payload';

@Injectable()
export class PublicAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const admin = await this.adminService.findByEmail(email);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.adminService.validatePassword(
      password,
      admin.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtAdminPayload = {
      sub: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      kind: 'admin',
      ver: 1,
    };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
