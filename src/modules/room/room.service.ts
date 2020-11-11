import { Injectable } from '@nestjs/common';
import { RoomEntity } from './room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private _roomRepository: Repository<RoomEntity>,
  ) {}

  async getRooms() {
    return await this._roomRepository.find();
  }

  async getRoom(id: string) {
    const room = await this._roomRepository.findOne(id);

    room.votations = room.votations.sort((a, b) =>
      a.createdDate > b.createdDate ? 1 : -1,
    );

    return room;
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const newRoom = new RoomEntity();
    const rooms = await this._roomRepository.find();

    let id: string;
    do {
      id = '';
      for(let i = 0; i < 6; i++) {
        const random: number = Math.floor(Math.random() * 9);
        id += random.toString();
      }
    } while(rooms.find(r => r.id === id));

    newRoom.name = createRoomDto.name;
    newRoom.id = id;
    
    return await this._roomRepository.save(newRoom);
  }
}
