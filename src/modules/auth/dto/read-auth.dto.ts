import { Expose } from 'class-transformer';
import { Roles } from '../../user/enums/roles.enum';

export class AuthDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  token: string;

  @Expose()
  role: Roles;

  @Expose()
  changePassword: boolean
}
