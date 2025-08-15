import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

import { TENANT_NAME_RULE } from 'src/common/constants/tenantName';
export class CreateTenantDto {
  @ApiProperty({
    description:
      'Tenant name can only contain letters, numbers, and spaces, and cannot start or end with spaces',
    minLength: 3,
    maxLength: 30,
    example: 'Acme Tenant',
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
}
