import {
  Entity,
  Column,
  OneToMany,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './../user/user.entity';
import { VotationEntity } from '../votation/votation.entity';
import { Expose, Type } from 'class-transformer';
import { Status } from '../connection/enums/status.enum';
import { Roles } from '../user/enums/roles.enum';
import { ConnectionEntity } from '../connection/connection.entity';

@Entity('rooms')
export class RoomEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn()
  id: string;

  @Expose()
  @Column({ default: '' })
  name: string;

  @Expose()
  @Type(() => VotationEntity)
  @OneToMany(
    type => VotationEntity,
    votation => votation.room,
    { eager: true },
  )
  votations: VotationEntity[];

  @Type(() => ConnectionEntity)
  @OneToMany(
    type => ConnectionEntity,
    connection => connection.room,
    { eager: true },
  )
  connections: ConnectionEntity[];

  @Expose({ name: 'admins' })
  @Type(() => UserEntity)
  getAdmins() {
    if(!this.connections) 
      return [];

    const activeConnections = this.connections.filter(
      connection => connection.status === Status.PRESENT && connection.online,
    );
    
    const adminsConnections = activeConnections.filter(
      connection => connection.user.role === Roles.ADMIN,
    );

    const adminsUsers = adminsConnections.map(connection => connection.user);

    const president = activeConnections.find(
      connection => connection.user.role === Roles.PRESIDENT,
    );
    const vicePresident1 = activeConnections.find(
      connection => connection.user.role === Roles.VICE_PRESIDENT_1,
    );
    const vicePresident2 = activeConnections.find(
      connection => connection.user.role === Roles.VICE_PRESIDENT_2,
    );

    const currentPresident = president
      ? president
      : vicePresident1
      ? vicePresident1
      : vicePresident2;

    return currentPresident
      ? [currentPresident.user, ...adminsUsers]
      : adminsUsers;
  }

  @Expose({ name: 'users' })
  getOnlineConnections() {
    if(!this.connections) 
      return [];

    return this.connections.filter(c => c.online);
  }

  @Expose()
  @CreateDateColumn({name: 'created_date', type: 'timestamp'})
  created_date: Date;
}
