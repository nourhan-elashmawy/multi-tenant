import { Controller, Get, Req } from '@nestjs/common';
import * as tenantContextMiddleware from 'src/common/middleware/tenant-context.middleware';

@Controller('private')
export class PrivateController {
  constructor() {}

  @Get('health')
  tenantHealth(@Req() req: tenantContextMiddleware.TenantRequest) {
    return {
      status: 'ok',
      message: 'Tenant API is running',
      tenantSchema: req.tenantSchema,
      connectionStatus: req.tenantConnection?.isInitialized
        ? 'connected'
        : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
