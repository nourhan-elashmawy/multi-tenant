import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';

@Injectable()
export class TenantConnectionService {
  private tenantConnections = new Map<string, DataSource>();

  constructor(private configService: ConfigService) {}

  async createTenantConnection(tenantSchema: string): Promise<DataSource> {
    // Return existing connection if available
    if (this.tenantConnections.has(tenantSchema)) {
      const existingConnection = this.tenantConnections.get(tenantSchema);
      if (existingConnection?.isInitialized) {
        return existingConnection;
      }
    }

    // Create new connection
    const connectionOptions: DataSourceOptions = {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      schema: tenantSchema,
      entities: [
        path.join(__dirname, '../modules/private/**/*.entity{.ts,.js}'),
      ],
      synchronize: true,
      logging: true,
    };

    const dataSource = new DataSource(connectionOptions);
    await dataSource.initialize();

    this.tenantConnections.set(tenantSchema, dataSource);

    return dataSource;
  }

  async createSchemaIfNotExists(schemaName: string): Promise<void> {
    const publicDataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      schema: 'public',
      logging: false,
    });

    await publicDataSource.initialize();

    await publicDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    await publicDataSource.destroy();
  }

  async getTenantConnection(tenantSchema: string): Promise<DataSource> {
    const connection = this.tenantConnections.get(tenantSchema);

    if (!connection || !connection.isInitialized) {
      return this.createTenantConnection(tenantSchema);
    }

    return connection;
  }

  async closeTenantConnection(tenantSchema: string): Promise<void> {
    const connection = this.tenantConnections.get(tenantSchema);

    if (connection && connection.isInitialized) {
      await connection.destroy();
      this.tenantConnections.delete(tenantSchema);
    }
  }

  async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.tenantConnections.keys()).map(
      (tenantSchema) => this.closeTenantConnection(tenantSchema),
    );

    await Promise.all(closePromises);
  }
}
