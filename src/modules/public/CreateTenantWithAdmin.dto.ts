import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from 'src/common/constants/passwords';
import { TENANT_NAME_RULE } from 'src/common/constants/tenantName';

// name, email, password, description
export class CreateTenantWithAdminDto {
  @ApiProperty({
    description: 'Tenant name',
    example: 'Rose Store',
  })
  @IsString()
  @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
  @Matches(TENANT_NAME_RULE, {
    message:
      'Tenant name can only contain letters, numbers, and spaces, It also cannot start or end with spaces',
  })
  name: string;

  @ApiProperty({
    description: 'Email for tenant',
    example: 'name@rose.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for admin account',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Tenant description',
    example: 'This tenant handles all EU operations.',
  })
  @IsString()
  @Length(3, 255, {
    message: 'Description must be between 3 and 255 characters',
  })
  description: string;
}
