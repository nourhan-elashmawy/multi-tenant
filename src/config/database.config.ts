import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export default class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(schemaName: string = 'public'): DataSourceOptions {
    const username = this.configService.get<string>('DB_USERNAME');
    const password = this.configService.get<string>('DB_PASSWORD');
    const database = this.configService.get<string>('DB_NAME');

    if (!username || !password || !database) {
      throw new Error(
        'Missing required database configuration: DB_USERNAME, DB_PASSWORD, or DB_NAME',
      );
    }

    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username,
      password,
      database,
      schema: schemaName,
      entities: [
        __dirname + '/../modules/public/**/*.entity{.ts,.js}',
        __dirname + '/../modules/private/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
      // migrationsTableName: isPublic ? 'public_migrations' : 'tenant_migrations',
      // migrations: isPublic
      //   ? [__dirname + '/../database/migrations/public/*{.ts,.js}']
      //   : undefined,
      logging: true,
    };
  }
}
