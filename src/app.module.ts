import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PublicModule } from './modules/public/public.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PrivateModule } from './modules/private/private.module';
import { DatabaseModule } from './config/database.module';
import { PublicAuthModule } from './modules/public/auth/auth.module';
import { PrivateAuthModule } from './modules/private/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule,
    PublicModule,
    PrivateModule,
    PublicAuthModule,
    PrivateAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('private/*path');
  }
}
