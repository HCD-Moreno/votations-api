import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ConnectionService } from '../connection.service';

@Injectable()
export class ConnectionGuard implements CanActivate {
  constructor(private readonly _connectionService: ConnectionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socketId = context.switchToWs().getClient().client.id;

    let connection = await this._connectionService.getConnection({ where: { socketId } });

    if(!connection) {
      throw new WsException('the user never started connection in the room');
    }

    if (!connection.online) {
      throw new WsException('the user is disconnected from the room');
    }

    context.switchToWs().getData().connection = connection;

    return true;
  }
}
