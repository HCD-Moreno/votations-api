import {
  Entity,
  BaseEntity,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteEntity } from '../vote/vote.entity';
import { RoomEntity } from '../room/room.entity';
import { StatusVotation } from './enums/status-votation.enum';
import { Exclude, Expose } from 'class-transformer';
import { VoteService } from '../vote/vote.service';
import { TypeVote } from '../vote/enum/type.enum';
import { VotationType } from './enums/type.enum';

@Entity('votations')
export class VotationEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column()
  description: string;

  @Exclude()
  @OneToMany(
    type => VoteEntity,
    votes => votes.votation,
    { eager: true, cascade: true },
  )
  votes: VoteEntity[];

  @Expose({ name: 'votes' })
  getVotes(): {
    positives: VoteEntity[];
    negatives: VoteEntity[];
    abstentions: VoteEntity[];
  } {
    return {
      positives: this.votes.filter(vote => vote.type === TypeVote.POSITIVE),
      negatives: this.votes.filter(vote => vote.type === TypeVote.NEGATIVE),
      abstentions: this.votes.filter(vote => vote.type === TypeVote.ABSTENTION),
    };
  }

  @Expose({ name: 'voters' })
  getVoters() {
    return this.votes.map(vote => vote.user);
  }

  @Expose()
  @Column({type: 'enum', enum: VotationType, default: VotationType.SIMPLE_MAJORITY_OF_PRESENTS })
  type: VotationType;

  @Expose()
  @Column({ type: 'enum', enum: StatusVotation, default: StatusVotation.OPEN })
  status: StatusVotation;

  @ManyToOne(
    type => RoomEntity,
    room => room.votations,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn()
  room: RoomEntity;

  @Expose()
  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;
}
