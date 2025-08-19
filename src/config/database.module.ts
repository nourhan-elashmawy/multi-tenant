import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConnectionService } from './tenant-connection.service';
import { Tenant } from 'src/modules/public/tenant/tenant.entity';
import { Admin } from 'src/modules/public/admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        schema: 'public',
        entities: [Tenant, Admin],
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
