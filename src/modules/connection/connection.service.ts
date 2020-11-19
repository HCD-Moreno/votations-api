import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { FindOneOptions, Repository } from 'typeorm';
import { RoomEntity } from '../room/room.entity';
import { UserEntity } from '../user/user.entity';
import { ConnectionEntity } from './connection.entity';
import { Status } from './enums/status.enum';

@Injectable()
export class ConnectionService implements OnModuleInit{
  constructor(
    @InjectRepository(ConnectionEntity)
    private _connectionRepository: Repository<ConnectionEntity>,
  ) {}

  wss: Server;

  async onModuleInit() {    
      const connections = await this._connectionRepository.find();

      const disconnetions = connections.map(u => {
          u.online = false;
          return u;
      });

      await this._connectionRepository.save( disconnetions );
  }

  async getConnection(options: FindOneOptions<ConnectionEntity>): Promise<ConnectionEntity> {
    return await this._connectionRepository.findOne(options);
  }

  async createConnection(
    room: RoomEntity,
    user: UserEntity,
    client: Socket,
    connectionType: 'VIEWER' | 'GUEST'
    ) {
    if( connectionType === 'GUEST' ) {
      const connectionExist = await this._connectionRepository.findOne({
        where: { room, user },
      });
  
      const wasConnected = connectionExist ? connectionExist.online : false;
  
      if(connectionExist){
        const oldClient: Socket = this.wss.sockets.sockets[connectionExist.socketId];
        if(oldClient){
          oldClient.emit('room:new_connection_detected');
          oldClient.disconnect()
        }
      }
  
      const connection: ConnectionEntity = connectionExist
        ? connectionExist
        : new ConnectionEntity();
  
      if (!connectionExist) {
        connection.user = user;
        connection.room = room;
      }
      connection.socketId = client.id;
      connection.online = true;
  
      await this._connectionRepository.save(connection);
  
      await room.reload();
  
      if (!wasConnected) {
        client.broadcast.to(room.id).emit('user:add', classToPlain(connection));
      }
      if (connection.user.role) {
        this.wss.to(room.id).emit('admins:list', room.getAdmins());
      }
    }

    room.votations = room.votations.sort((a,b) => a.createdDate > b.createdDate ? -1 : 1);    
    client.emit('room:join', classToPlain(room));
  }

  async deleteConnection(room: RoomEntity, user: UserEntity) {
    const connection = await this._connectionRepository.findOne({
      where: { room, user },
    });

    connection.socketId = null;
    connection.online = false;

    const deletedUser = await connection.save();
    this.wss.to(room.id).emit('user:delete', { userId: connection.user.id });

    if (connection.user.role) {
      await room.reload();
      this.wss.to(room.id).emit('admins:list', room.getAdmins());
    }
  }

  async changeStatus(userId: string, room: RoomEntity) {
    const connection = await this._connectionRepository.findOne({
      where: { user: { id: userId }, room },
    });

    const isPresent = Boolean(connection.status === Status.PRESENT);

    connection.status = isPresent ? Status.ABSENT : Status.PRESENT;

    return await this._connectionRepository.save(connection);
  }

  /* async deleteConnections() {
    const connections = await this._connectionRepository.find()
    const connectionsId = connections.map(c => c.id)
    return await this._connectionRepository.delete(connectionsId)
  } */
}
