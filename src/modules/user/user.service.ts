import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserEntity } from './user.entity';
import { unlinkSync } from 'fs';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    const newUser: UserEntity = plainToClass(UserEntity, userDto);

    const salt = await genSalt(10);
    newUser.password = await hash(userDto.password, salt);

    return await this._userRepository.save(newUser);
  }

  async updateUser(
    userId: string,
    partialUser: Partial<UpdateUserDto>,
  ): Promise<UserEntity> {
    await this._userRepository.update(userId, partialUser);

    return await this._userRepository.findOne(userId);
  }

  async deleteUser(userId: string): Promise<DeleteResult> {
    const user = await this._userRepository.findOne(userId);
    if(user.avatar) {
      try {
        unlinkSync(`./static/uploads/${user.avatar}`)
      } catch (e) {
        console.log(e);
      }
    }
    return this._userRepository.delete(userId);
  }

  async getUser(userId: string): Promise<UserEntity> {
    return this._userRepository.findOne(userId);
  }

  async getUsers(onlyCounciliors?: boolean): Promise<UserEntity[]> {
    if (!onlyCounciliors) return this._userRepository.find();
    else return this._userRepository.find({ where: { isConcejal: true } });
  }

  async changeAvatar(userId: string, file: any) {
    const user = await this._userRepository.findOne(userId);
    if(!user) throw new BadRequestException();

    if(user.avatar) {
      try {
        unlinkSync(`./static/uploads/${user.avatar}`)
      } catch (e) {
        console.log(e);
      }
    }

    user.avatar = file.filename;
    return this._userRepository.save(user)
  }
}
