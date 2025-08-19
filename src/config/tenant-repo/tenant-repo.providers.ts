import { Scope } from '@nestjs/common';
import {
  TENANT_PRODUCT_REPOSITORY,
  TENANT_USER_REPOSITORY,
} from './tenant-rep.tokens';
import { REQUEST } from '@nestjs/core';
import { TenantConnectionService } from '../tenant-connection.service';
import { TenantRequest } from 'src/common/middleware/tenant-context.middleware';
import { Repository } from 'typeorm';
import { User } from 'src/modules/private/user/user.entity';
import { DataSource } from 'typeorm/browser';
import { Product } from 'src/modules/private/product/product.entity';

export const tenantRepositoryProviders = [
  {
    provide: TENANT_USER_REPOSITORY,
    scope: Scope.REQUEST,
    inject: [REQUEST, TenantConnectionService],
    useFactory: async (
      req: TenantRequest,
      tcs: TenantConnectionService,
    ): Promise<Repository<User>> => {
      const ds: DataSource =
        req.tenantConnection ??
        (await tcs.getTenantConnection(req.tenantSchema!));
      return ds.getRepository(User);
    },
  },
  {
    provide: TENANT_PRODUCT_REPOSITORY,
    scope: Scope.REQUEST,
    inject: [REQUEST, TenantConnectionService],
    useFactory: async (
      req: TenantRequest,
      tcs: TenantConnectionService,
    ): Promise<Repository<Product>> => {
      const ds: DataSource =
        req.tenantConnection ??
        (await tcs.getTenantConnection(req.tenantSchema!));
      return ds.getRepository(Product);
    },
  },
];
