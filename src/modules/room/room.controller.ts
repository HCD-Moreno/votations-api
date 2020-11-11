import {
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dtos/create-room.dto';

@Controller('rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  getRooms() {
    return this.roomService.getRooms();
  }

  @Get(':id')
  getRoom(@Param('id') id) {
    return this.roomService.getRoom(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  creteRoom(@Body() createRoom: CreateRoomDto) {
    return this.roomService.createRoom(createRoom);
  }
}
