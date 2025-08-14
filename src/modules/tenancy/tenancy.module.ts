// src/modules/tenancy/tenancy.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TenantConnectionService } from './tenant-connection.service';
import { DatabaseConfig } from '../../config/database.config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), // Temporary for middleware
  ],
  providers: [TenantConnectionService, DatabaseConfig],
  exports: [TenantConnectionService, DatabaseConfig],
})
export class TenancyModule {}
