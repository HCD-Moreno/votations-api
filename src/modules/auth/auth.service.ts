import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { SinginDto } from './dto';
import { UserEntity } from './../user/user.entity';
import { IJwtPayload } from './jwt-payload.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { AuthDto } from './dto/read-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async singin(singinDto: SinginDto): Promise<AuthDto> {
    const { username, password } = singinDto;
    const user: UserEntity = await this._authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        'the email does not belong to a registered user',
      );
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalidate password');
    }

    const payload: IJwtPayload = {
      id: user.id,
      password: user.password,
    };

    const token = this._jwtService.sign(payload);

    let authDto: AuthDto = plainToClass(AuthDto, user, {
      excludeExtraneousValues: true,
    });
    authDto.token = token;
    authDto.avatar = user.getAvatarURL();

    return authDto;
  }

  async validateUser(validate: IJwtPayload): Promise<UserEntity> {
    const { id, password } = validate;
    const user = await this._authRepository.findOne({where: {id, password}});
    return user;
  }

  async changePassword(userId: string, changePassword: ChangePasswordDto):
   Promise<UserEntity>{
    const user = await this._authRepository.findOne(userId);

    
    const salt = await genSalt(10);
    user.password = await hash(changePassword.newPassword, salt);
    
    user.changePassword = changePassword.changeLater || false;

    return await this._authRepository.save(user)
  }
}
