import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Tenant ID (3 digits)',
    example: '001',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{3}$/, {
    message: 'Tenant ID must be exactly 3 digits (e.g., "001")',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Tenant name',
    example: 'Acme Corporation',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Tenant description',
    example: 'Main corporate tenant',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
