import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TenantConnectionService } from '../../modules/tenancy/tenant-connection.service';
import { DataSource } from 'typeorm';
import { JwtPayload } from 'src/modules/auth/jwt.strategy';

export interface TenantRequest extends Request {
  tenantId?: number;
  tenantSchema?: string;
  tenantConnection: DataSource;
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private tenantConnectionService: TenantConnectionService,
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestException(
          'Missing or invalid authorization header',
        );
      }

      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify<JwtPayload>(token);

      if (payload.tenantId && payload.tenantSchema) {
        req.tenantId = payload.tenantId;
        req.tenantSchema = payload.tenantSchema;

        // Get tenant connection and attach to request
        req.tenantConnection =
          await this.tenantConnectionService.getTenantConnection(
            payload.tenantSchema,
          );
      }

      next();
    } catch {
      throw new BadRequestException('Invalid tenant context');
    }
  }
}
