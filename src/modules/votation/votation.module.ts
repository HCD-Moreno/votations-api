import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotationEntity } from './votation.entity';
import { VotationService } from './votation.service';
import { RoomEntity } from '../room/room.entity';
import { UserEntity } from '../user/user.entity';
import { VoteEntity } from '../vote/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VotationEntity, VoteEntity])],
  providers: [VotationService],
  exports: [VotationService],
})
export class VotationModule {}
