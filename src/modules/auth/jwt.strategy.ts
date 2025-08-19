import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, Principal } from 'src/common/constants/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): Principal {
    const base = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    if (payload.kind === 'admin') return { kind: 'admin', ...base };
    if (payload.kind === 'user')
      return { kind: 'user', ...base, tenantSchema: payload.tenantSchema };
    throw new UnauthorizedException('Unsupported principal kind');
  }
}
