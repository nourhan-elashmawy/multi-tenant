import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from 'src/common/constants/passwords';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
  })
  @IsNotEmpty()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Tenant identifier',
    example: '001',
  })
  @IsNumber()
  @IsString()
  tenantId: string;
}
