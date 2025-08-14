import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30, { message: 'Tenant name must be between 3 and 30 characters' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Tenant name can only contain letters, numbers, and spaces',
  })
  @Matches(/^[a-zA-Z0-9].*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/, {
    message: 'Tenant name cannot start or end with spaces',
  })
  name: string;

  @IsNotEmpty()
  @Length(255)
  description: string;
}
