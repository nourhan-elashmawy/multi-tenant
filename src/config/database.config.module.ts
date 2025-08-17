import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TenantConnectionService } from './tenant-connection.service';
import path from 'path';

@Module({
  imports: [
    // Public schema connection for tenant management
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        schema: 'public',
        entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TenantConnectionService],
  exports: [TenantConnectionService],
})
export class DatabaseModule {}
