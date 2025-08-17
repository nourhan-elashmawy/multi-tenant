import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getConfig(schemaName: string = 'public') {
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
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
