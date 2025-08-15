import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { TENANT_NAME_RULE } from 'src/common/constants/tenantName';

// name, description, email
export class CreateTenantDto {
  @ApiProperty({
    description:
      'Tenant name can only contain letters, numbers, and spaces, and cannot start or end with spaces',
    minLength: 3,
    maxLength: 30,
    example: 'Rose store',
  })
  @IsString()
  @Length(3, 30, { message: 'Tenant name must be between 3 and 30 characters' })
  @Matches(TENANT_NAME_RULE, {
    message:
      'Tenant name can only contain letters, numbers, and spaces, It also cannot start or end with spaces',
  })
  name: string;

  @ApiProperty({
    description: 'Description must be between 3 and 255 characters',
    minLength: 3,
    maxLength: 255,
    example: 'This tenant handles all EU operations.',
  })
  @IsString()
  @Length(3, 255, {
    message: 'Description must be between 3 and 255 characters',
  })
  description: string;

  @ApiProperty({
    description: 'Tenant email',
    example: 'name@rose.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
