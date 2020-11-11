import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  DeleteDateColumn,
} from 'typeorm';
import { Roles } from './enums/roles.enum';

@Entity('users')
@Exclude()
export class UserEntity extends BaseEntity {

  static uploadsURL: string;

  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  username: string;

  @Expose()
  @Column()
  politicalParty: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Expose({name: 'avatar'})
  getAvatarURL(){
    if(!this.avatar)
      return null;
    return 'http://' + UserEntity.uploadsURL + '/uploads/' + this.avatar;
  }

  @Expose()
  @Column()
  firstName: string;

  @Expose()
  @Column()
  lastName: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Roles,
    nullable: true,
  })
  role: Roles;

  @Expose()
  @Column({ type: 'bool', default: false })
  isConcejal: boolean;

  @Expose()
  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({default: true})
  changePassword: boolean;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @DeleteDateColumn({name: 'deleted_date', type: 'timestamp'})
  deletedDate: Date;
}
