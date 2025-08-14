import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getPublicConfig() {
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      schema: 'public',
      entities: [__dirname + '/../modules/public/entities/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsTableName: 'public_migrations',
      migrations: [__dirname + '/../database/migrations/public/*{.ts,.js}'],
      logging: true,
    };
  }

  getTenantConfig(schemaName: string) {
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      schema: schemaName,
      entities: [__dirname + '/../modules/tenant/entities/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsTableName: 'tenant_migrations',
      logging: true,
    };
  }
}
