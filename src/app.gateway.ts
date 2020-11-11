import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtGuard } from './modules/auth/jwt.guard';
import { GetUser } from './modules/auth/decorators/user.decorator';
import { UserEntity } from './modules/user/user.entity';
import { RoomGuard } from './modules/room/guards/room.guard';
import { GetRoom } from './modules/room/decorators/room.decorator';
import { RoomEntity } from './modules/room/room.entity';
import { VotationService } from './modules/votation/votation.service';
import { VoteService } from './modules/vote/vote.service';
import { CreateVotationDto } from './modules/votation/dtos';
import { AuthGuard } from '@nestjs/passport';
import { TypeVote } from './modules/vote/enum/type.enum';
import { RoomService } from './modules/room/room.service';
import { UserService } from './modules/user/user.service';
import { classToPlain, plainToClass, serialize } from 'class-transformer';
import { Status } from './modules/connection/enums/status.enum';
import { Roles } from './modules/user/enums/roles.enum';
import { ConnectionService } from './modules/connection/connection.service';
import { ConnectionGuard } from './modules/connection/guards/connection.guard';

@UseGuards(JwtGuard, RoomGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(
    private readonly _votationService: VotationService,
    private readonly _voteService: VoteService,
    private readonly _connectionService: ConnectionService,
  ) {}

  logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this._votationService.wss = server;
    this._voteService.wss = server;
    this._connectionService.wss = server;
  }

  handleConnection(client: Socket) {
    this.logger.log('Connected: ' + client.id);
  }

  @SubscribeMessage('room:join')
  async newConnection(
    @ConnectedSocket() client: Socket,
    @GetUser() user: UserEntity,
    @GetRoom() room: RoomEntity,
    @MessageBody() data: { connectionType }
  ): Promise<void> {
    client.join(room.id);
    this._connectionService.createConnection( room, user, client, data.connectionType );
  }

  @SubscribeMessage('room:leave')
  async deleteConnection(
    @ConnectedSocket() client: Socket,
    @GetUser() user: UserEntity,
    @GetRoom() room: RoomEntity,
  ): Promise<void> {
    client.join(room.id);
    this._connectionService.deleteConnection(room, user);
  }

  @UseGuards(ConnectionGuard)
  @SubscribeMessage('user:status')
  async UserStatus(
    @GetRoom() room: RoomEntity,
    @MessageBody() data: { userId: string },
  ) {
    const connection = await this._connectionService.changeStatus(
      data.userId,
      room,
    );
    this.wss.to(room.id).emit('user:save', classToPlain(connection));

    if (connection.user.role) {
      await room.reload();
      this.wss.to(room.id).emit('admins:list', room.getAdmins());
    }
  }

  /**
   * Votaciones
   */

  @UseGuards(ConnectionGuard)
  @SubscribeMessage('votation:create')
  async handleCreateVotation(
    @MessageBody() data: CreateVotationDto,
    @GetRoom() room: RoomEntity,
  ): Promise<void> {
    await this._votationService.createVotation(room, data);
  }

  @UseGuards(ConnectionGuard)
  @SubscribeMessage('send vote')
  async handleVote(
    @MessageBody() data: { votationId: string; vote: TypeVote },
    @GetUser() user: UserEntity,
    @GetRoom() room: RoomEntity,
  ): Promise<void> {
    await this._voteService.createVote(user, room, data.votationId, data.vote);
  }
}
