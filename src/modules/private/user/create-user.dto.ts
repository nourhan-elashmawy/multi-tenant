import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { USER_ROLES } from 'src/common/constants/enums';
import {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from 'src/common/constants/passwords';

export class CreateUserDto {
  @IsString()
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(PASSWORD_RULE, {
    message: PASSWORD_RULE_MESSAGE,
  })
  password: string;

  @IsOptional()
  @IsEnum(USER_ROLES, { message: 'Role must be admin, customer, or manager' })
  role?: string;
}
