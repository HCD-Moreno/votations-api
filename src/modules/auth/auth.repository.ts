import { UserEntity } from '../user/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { SingupDto } from './dto';

import { genSalt, hash } from 'bcryptjs';

@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {
  async signup(signupDto: SingupDto) {
    const { username, password, firstName, lastName } = signupDto;
    const user = new UserEntity();
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    return await user.save();
  }
}
