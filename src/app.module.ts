import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';
import { TenancyModule } from './modules/tenancy/tenancy.module';
import { PublicModule } from './modules/public/public.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { DatabaseConfigModule } from './config/database.config.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'public',
      imports: [DatabaseConfigModule],
      useFactory: (DatabaseConfig: DatabaseConfig) =>
        DatabaseConfig.getPublicConfig(),
      inject: [DatabaseConfig],
    }),
    TenancyModule,
    PublicModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseConfig],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('tenant/*path');
  }
}
