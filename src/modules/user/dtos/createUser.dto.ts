import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  politicalParty: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  //@IsEnum(Roles)
  role: Roles;

  @IsBoolean()
  isConcejal: boolean;
}
