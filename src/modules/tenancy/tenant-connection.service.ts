import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DatabaseConfig } from 'src/config/database.config';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantConnectionService implements OnModuleDestroy {
  private connections = new Map<string, DataSource>();

  constructor(private databaseConfig: DatabaseConfig) {}

  async getTenantConnection(tenantSchema: string): Promise<DataSource> {
    // Return existing connection if available
    if (this.connections.has(tenantSchema)) {
      const connection = this.connections.get(tenantSchema);
      if (connection?.isInitialized) {
        return connection;
      }
    }

    // Create new connection
    const tenantConfig = this.databaseConfig.getTenantConfig(tenantSchema);
    const dataSource = new DataSource(tenantConfig);

    await dataSource.initialize();
    this.connections.set(tenantSchema, dataSource);

    return dataSource;
  }

  // TO DO: remove this
  async createTenantSchema(tenantSchema: string): Promise<void> {
    const publicConnection = new DataSource(
      this.databaseConfig.getPublicConfig(),
    );
    await publicConnection.initialize();

    const queryRunner = publicConnection.createQueryRunner();
    await queryRunner.createSchema(tenantSchema, true); // true = IF NOT EXISTS
    await queryRunner.release();

    await publicConnection.destroy();

    const tenantConnection = await this.getTenantConnection(tenantSchema);
    await tenantConnection.synchronize();

    // TO DO: Remove these comments after setting up migrations
    // Get tenant connection and run migrations
    // const tenantConnection = await this.getTenantConnection(tenantSchema);
    // await tenantConnection.runMigrations();
  }

  async onModuleDestroy() {
    // Close all tenant connections
    for (const connection of this.connections.values()) {
      if (connection.isInitialized) {
        await connection.destroy();
      }
    }
  }
}
