import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoomService } from '../room.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RoomGuard implements CanActivate {
  constructor(private readonly _roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roomId = context.switchToWs().getClient().handshake.query.Room;

    if (!roomId) {
      throw new WsException('roomId request is empty');
    }

    let room = await this._roomService.getRoom(roomId);

    if (!room) {
      throw new WsException('the requested room cannot be found');
    }

    context.switchToWs().getData().room = room;

    return true;
  }
}
