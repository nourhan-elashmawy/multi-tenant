import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './create-admin.dto';
import { Admin } from './admin.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ADMIN_ROLES } from 'src/common/constants/enums';

@Controller('public/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  @Post('create')
  async createAdmin(@Body() adminData: CreateAdminDto): Promise<Admin> {
    return await this.adminService.createAdmin(adminData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ADMIN_ROLES.ADMIN)
  @Get('')
  async getAllAdmins(): Promise<Admin[]> {
    return this.adminService.getAllAdmins();
  }
}
