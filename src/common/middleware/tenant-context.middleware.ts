import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantConnectionService } from '../../config/tenant-connection.service';
import { DataSource } from 'typeorm';

export interface TenantRequest extends Request {
  tenantSchema?: string;
  tenantConnection?: DataSource;
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private tenantConnectionService: TenantConnectionService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const headerValue = req.header('x-tenant-id');

      if (!headerValue) {
        throw new BadRequestException('Missing x-tenant-id header');
      }

      const tenantSchema = headerValue.trim();
      if (!tenantSchema) {
        throw new BadRequestException('Invalid x-tenant-id header');
      }

      req.tenantSchema = tenantSchema;
      req.tenantConnection =
        await this.tenantConnectionService.getTenantConnection(tenantSchema);
      next();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      // optionally log err here
      throw new BadRequestException('Invalid tenant context');
    }
  }
}
