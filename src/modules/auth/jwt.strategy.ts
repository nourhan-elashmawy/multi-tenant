import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, Principal } from 'src/common/constants/payload';
import { AdminService } from '../public/admin/admin.service';
import { UserService } from '../private/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload): Promise<Principal> {
    const base = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    if (payload.kind === 'admin') {
      const admin = await this.adminService.findById(payload.sub);
      if (!admin) throw new UnauthorizedException('Admin no longer exists');

      const isActive = await this.adminService.isActive(payload.sub);
      if (!isActive) throw new UnauthorizedException('Admin no longer exists');

      if (admin.role !== payload.role) {
        throw new UnauthorizedException('User role has changed');
      }

      return { kind: 'admin', ...base };
    }
    if (payload.kind === 'user') {
      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User no longer exists');

      const isActive = await this.userService.isActive(payload.sub);
      if (!isActive) throw new UnauthorizedException('User no longer exists');

      if (user.role !== payload.role) {
        throw new UnauthorizedException('User role has changed');
      }

      return { kind: 'user', ...base, tenantSchema: payload.tenantSchema };
    }

    throw new UnauthorizedException('Unsupported principal kind');
  }
}
