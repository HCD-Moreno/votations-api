import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from './vote.entity';
import { VoteService } from './vote.service';
import { VotationEntity } from '../votation/votation.entity';
import { VotationModule } from '../votation/votation.module';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteEntity, VotationEntity, UserEntity]),
    VotationModule,
  ],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
