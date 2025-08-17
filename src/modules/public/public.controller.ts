import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  constructor() {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      message: 'Public API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
