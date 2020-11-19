import {
    Controller,
    ClassSerializerInterceptor,
    UseInterceptors,
    Post,
    UseGuards,
  } from '@nestjs/common';
import { Roles } from './modules/auth/decorators/roles.decorator';
import { JwtGuard } from './modules/auth/jwt.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { ConnectionService } from './modules/connection/connection.service';
import { RoomService } from './modules/room/room.service';
  
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
    constructor(
        private _connectionService: ConnectionService,
        private _roomService: RoomService
    ) {}

    @Post('reset')
    @Roles('ADMIN')
    @UseGuards(JwtGuard, RolesGuard)
    resetDB() {
        return this._roomService.deleteRooms()
    }

}
  