import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { DatabaseModule } from './config/database.config.module';
import { PublicModule } from './modules/public/public.module';
import { JwtModule } from '@nestjs/jwt';
import { PrivateModule } from './modules/private/private.module';

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
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('private/*path');
  }
}
