import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getAll(@Query('onlyCounciliors') onlyCounciliors: boolean) {
    return this._userService.getUsers(onlyCounciliors);
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.getOne(id);
  }

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this._userService.createUser(userDto);
  }

  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: Partial<UpdateUserDto>) {
    return this._userService.updateUser(id, userDto);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('image'))
  updateAvatar(@Param('id') id: string, @UploadedFile() file) {
    return this._userService.changeAvatar(id, file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this._userService.deleteUser(id);
  }
}
