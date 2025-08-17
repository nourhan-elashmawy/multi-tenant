import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant/tenant.service';
@Controller('public')
export class PublicController {
  constructor(private tenantService: TenantService) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: 'Public API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
