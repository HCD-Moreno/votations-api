import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, In } from 'typeorm';
import { VotationEntity } from './votation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVotationDto } from './dtos';
import { Server } from 'socket.io';
import { RoomEntity } from '../room/room.entity';
import { StatusVotation } from './enums/status-votation.enum';
import { classToPlain, plainToClass } from 'class-transformer';
import { VoteEntity } from '../vote/vote.entity';
import { UserEntity } from '../user/user.entity';
import { Status } from '../connection/enums/status.enum';
import { TypeVote } from '../vote/enum/type.enum';
import { VotationType } from './enums/type.enum';

@Injectable()
export class VotationService {
  constructor(
    @InjectRepository(VotationEntity)
    private readonly _votationRepository: Repository<VotationEntity>,
    @InjectRepository(RoomEntity)
    private readonly _roomRepository: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  wss: Server;

  async createVotation(
    room: RoomEntity,
    createVotationDto: CreateVotationDto,
  ): Promise<void> {
    let votation: VotationEntity = new VotationEntity();

    votation.title = createVotationDto.title;
    votation.description = createVotationDto.description;
    votation.type = createVotationDto.type;

    votation.room = room;

    const votersConnection = room.connections.filter(
      c => c.status === Status.PRESENT && c.user.isConcejal && c.online,
    );

    votation.votes = votersConnection.map(voter => {
      const vote = new VoteEntity();
      vote.user = voter.user;

      return vote;
    });

    const created = await this._votationRepository.save(votation);

    this.wss.to(room.id).emit('votation:create', classToPlain(created));

    setTimeout(async () => {
      await this.closeVotation(created);
    }, 15 * 1000);
  }

  async closeVotation(votation: VotationEntity): Promise<void> {
    await votation.reload();

    const partial: Partial<VotationEntity> = {};

    const positivesVotes = votation.getVotes().positives;
    const abstentionsVotes = votation.getVotes().abstentions;

    switch(votation.type) {
      case VotationType.SIMPLE_MAJORITY_OF_PRESENTS:
        partial.status =
          positivesVotes.length > (votation.votes.length - abstentionsVotes.length) / 2 ?
          StatusVotation.WON_POSITIVE : StatusVotation.WON_NEGATIVE;
        break;
      case VotationType.TWO_THIRD_OF_COUNCILIORS:
        partial.status = positivesVotes.length > 16 ?
          StatusVotation.WON_POSITIVE : StatusVotation.WON_NEGATIVE;
        break;
      default:
        break;
    }

    await this._votationRepository.update(votation.id, partial);

    await votation.reload();

    this.wss
      .to(votation.room.id)
      .emit('votation:close', classToPlain(votation));
  }
}
