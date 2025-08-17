import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import path from 'path';

export interface TenantConnection {
  tenantId: string;
  dataSource: DataSource;
}

@Injectable()
export class TenantConnectionService {
  private readonly logger = new Logger(TenantConnectionService.name);
  private tenantConnections = new Map<string, DataSource>();

  constructor(private configService: ConfigService) {}

  async createTenantConnection(tenantId: string): Promise<DataSource> {
    try {
      // Check if connection already exists
      if (this.tenantConnections.has(tenantId)) {
        const existingConnection = this.tenantConnections.get(tenantId);
        if (existingConnection?.isInitialized) {
          return existingConnection;
        }
      }

      // Create new connection for tenant
      const connectionOptions: DataSourceOptions = {
        type: 'postgres',
        host: this.configService.get('DB_HOST'),
        port: this.configService.get('DB_PORT'),
        username: this.configService.get('DB_USERNAME'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DB_NAME'),
        schema: tenantId,
        entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
        synchronize: true,
        logging: true,
      };

      const dataSource = new DataSource(connectionOptions);
      await dataSource.initialize();

      this.tenantConnections.set(tenantId, dataSource);
      this.logger.log(`Created database connection for tenant: ${tenantId}`);

      return dataSource;
    } catch (error) {
      this.logger.error(
        `Failed to create connection for tenant ${tenantId}:`,
        error,
      );
      throw error;
    }
  }

  async createSchemaIfNotExists(schemaName: string): Promise<void> {
    try {
      // Create a connection to the public schema to create the new schema
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

      // Create the schema if it doesn't exist
      await publicDataSource.query(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );

      this.logger.log(`Created schema: ${schemaName}`);

      await publicDataSource.destroy();
    } catch (error) {
      this.logger.error(`Failed to create schema ${schemaName}:`, error);
      throw error;
    }
  }

  async getTenantConnection(tenantId: string): Promise<DataSource> {
    const connection = this.tenantConnections.get(tenantId);

    if (!connection || !connection.isInitialized) {
      return this.createTenantConnection(tenantId);
    }

    return connection;
  }

  async closeTenantConnection(tenantId: string): Promise<void> {
    const connection = this.tenantConnections.get(tenantId);

    if (connection && connection.isInitialized) {
      await connection.destroy();
      this.tenantConnections.delete(tenantId);
      this.logger.log(`Closed database connection for tenant: ${tenantId}`);
    }
  }

  async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.tenantConnections.keys()).map(
      (tenantId) => this.closeTenantConnection(tenantId),
    );

    await Promise.all(closePromises);
    this.logger.log('Closed all tenant database connections');
  }
}
