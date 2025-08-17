import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantConnectionService } from './tenant-connection.service';
import { DatabaseConfig } from '../../config/database.config';

@Module({
  imports: [ConfigModule],
  providers: [TenantConnectionService, DatabaseConfig],
  exports: [TenantConnectionService, DatabaseConfig],
})
export class TenancyModule {}
