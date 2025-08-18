import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PublicModule } from './modules/public/public.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { PrivateModule } from './modules/private/private.module';
import { DatabaseConfigModule } from './config/database.config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    DatabaseConfigModule,
    JwtModule,
    PublicModule,
    PrivateModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('private/*path');
  }
}
