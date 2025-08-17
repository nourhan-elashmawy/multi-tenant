import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './create-admin.dto';
import { Admin } from './admin.entity';

@Controller('public/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('create')
  async createAdmin(@Body() adminData: CreateAdminDto): Promise<Admin> {
    return await this.adminService.createAdmin(adminData);
  }
}
