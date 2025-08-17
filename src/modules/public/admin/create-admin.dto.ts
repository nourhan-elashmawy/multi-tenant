import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ADMIN_ROLES } from 'src/common/constants/enums';
import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from 'src/common/constants/passwords';
import { ApiProperty } from '@nestjs/swagger';

// name, email, password, role
export class CreateAdminDto {
  @ApiProperty({
    description: 'Name must be between 3 and 30 characters',
    minLength: 3,
    maxLength: 30,
    example: 'John Doe',
  })
  @IsString()
  @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'Johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password that satisfies the required complexity rules',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  @Matches(PASSWORD_RULE, { message: PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Role assigned to the admn',
    enum: ADMIN_ROLES,
    example: 'tenant_admin',
  })
  @IsNotEmpty()
  @IsEnum(ADMIN_ROLES)
  role: string;
}
