import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Patch,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { SinginDto } from './dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/read-auth.dto';
import { GetUser } from './decorators/user.decorator';
import { JwtGuard } from './jwt.guard';
import { UserEntity } from '../user/user.entity';
import { classToPlain } from 'class-transformer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../user/enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() singinDto: SinginDto): Promise<AuthDto> {
    return this._authService.singin(singinDto);
  }

  @Patch('password/:id') 
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser() user: UserEntity,
    @Param('id') userId:string ): Promise<UserEntity>
  {
    if(user.id === userId || user.role === Roles.ADMIN){
      return this._authService.changePassword(userId, dto)
    } else {
      throw new  UnauthorizedException;
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  getAuthUser(@GetUser() user: UserEntity) {
    return classToPlain(user);
  }
}
