// auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PublicAuthService } from './public-auth.service';
import { PrivateAuthService } from './private-auth.service';
import { PublicModule } from '../public/public.module';
import { PrivateModule } from '../private/private.module';

@Module({
  imports: [
    PassportModule,
    PublicModule,
    PrivateModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [PublicAuthService, PrivateAuthService, JwtStrategy],
  exports: [PublicAuthService, PrivateAuthService],
})
export class AuthModule {}
