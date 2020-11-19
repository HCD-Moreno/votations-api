import { UserEntity } from '../user/user.entity';
import { Repository, EntityRepository } from 'typeorm';

import { genSalt, hash } from 'bcryptjs';

@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {
}
