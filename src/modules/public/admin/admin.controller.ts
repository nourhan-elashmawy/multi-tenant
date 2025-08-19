import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './create-admin.dto';
import { Admin } from './admin.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('public/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAdmin(@Body() adminData: CreateAdminDto): Promise<Admin> {
    return await this.adminService.createAdmin(adminData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminService.getAllAdmins();
  }
}
