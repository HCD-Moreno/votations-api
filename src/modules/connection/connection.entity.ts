import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../user/user.entity';
import { RoomEntity } from '../room/room.entity';
import { Status } from './enums/status.enum';

@Exclude()
@Entity('connections')
export class ConnectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  @Column({ type: 'enum', enum: Status, default: Status.PRESENT })
  status: Status;

  @ManyToOne(type => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity

  @ManyToOne(
    type => RoomEntity,
    room => room.connections,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn()
  room: RoomEntity;

  @Column({ default: true })
  online: boolean;

  @Expose({ name: 'firstName' })
  getUserFirstName() {
    return this.user.firstName;
  }

  @Expose({ name: 'lastName' })
  getUserLastName() {
    return this.user.lastName;
  }

  @Expose({ name: 'avatar' })
  getUserAvatar() {
    return this.user.getAvatarURL();
  }

  @Expose({ name: 'politicalParty' })
  getUserPoliticalParty() {
    return this.user.politicalParty;
  }

  @Expose({ name: 'id' })
  getUserId() {
    return this.user.id;
  }

  @Expose({ name: 'isConcejal' })
  getUserIsConcejal() {
    return this.user.isConcejal;
  }

  @Expose({ name: 'role' })
  getUserRole() {
    return this.user.role;
  }

  @Expose({ name: 'status' })
  getStatus() {
    return this.online ? this.status : Status.ABSENT;
  }
}
