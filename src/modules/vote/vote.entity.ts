import {
  Entity,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { VotationEntity } from '../votation/votation.entity';
import { UserEntity } from '../user/user.entity';
import { TypeVote } from './enum/type.enum';

@Entity('votes')
export class VoteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TypeVote, default: TypeVote.ABSTENTION })
  type: TypeVote;

  @ManyToOne(type => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(
    type => VotationEntity,
    votation => votation.votes,
  )
  @JoinColumn()
  votation: VotationEntity;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;
}
