import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionEntity } from './connection.entity';
import { ConnectionService } from './connection.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionEntity])],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
