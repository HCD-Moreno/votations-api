import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RoomEntity } from '../room.entity';

export const GetRoom = createParamDecorator(
  (data: any, context: ExecutionContext): RoomEntity => {
    const req = context.switchToWs().getData().room;

    return req;
  },
);
