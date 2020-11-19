import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteEntity } from './vote.entity';
import { VotationEntity } from '../votation/votation.entity';
import { Repository, In } from 'typeorm';
import { WsException } from '@nestjs/websockets';
import { VotationService } from '../votation/votation.service';
import { Server } from 'socket.io';
import { UserEntity } from '../user/user.entity';
import { RoomEntity } from '../room/room.entity';
import { StatusVotation } from '../votation/enums/status-votation.enum';
import { TypeVote } from './enum/type.enum';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly _voteRepository: Repository<VoteEntity>,
    @InjectRepository(VotationEntity)
    private readonly _votationRepository: Repository<VotationEntity>,
    private readonly _votationService: VotationService,
  ) {}

  wss: Server;

  async createVote(
    user: UserEntity,
    room: RoomEntity,
    votationId: string,
    vote: TypeVote,
  ) {
    const votation = await this._votationRepository.findOne(votationId);
    if (!votation) {
      throw new WsException('La votacion recibida no existe');
    }

    if (
      votation.status != StatusVotation.OPEN &&
      votation.status != StatusVotation.HIDE
    ) {
      throw new WsException('La votacion recibida ya está cerrada.');
    }

    const updateVote = await this._voteRepository.findOne({
      where: { user, votation },
    });
    if (!updateVote) {
      throw new WsException('No estas autorizado para votar esto');
    }

    updateVote.type = vote;

    await this._voteRepository.save(updateVote);

    await votation.reload();

    const missingVotes = votation.votes.filter(v => v.type === TypeVote.NONE)

    if(missingVotes.length === 0) {
      this._votationService.closeVotation(votation)
    }
  }
}
