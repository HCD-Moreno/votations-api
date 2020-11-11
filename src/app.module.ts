import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { Configuration } from './config/config.keys';
import { ConfigService } from './config/config.service';
import { VotationModule } from './modules/votation/votation.module';
import { VoteModule } from './modules/vote/vote.module';
import { AppGateway } from './app.gateway';
import { ConnectionModule } from './modules/connection/connection.module';
import { ConfigMiddleware } from './config/middlewares/config.middleware';

@Module({
  imports: [
    UserModule,
    RoomModule,
    AuthModule,
    ConfigModule,
    DatabaseModule,
    VotationModule,
    VoteModule,
    ConnectionModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ConfigMiddleware).forRoutes({path: '*', method: RequestMethod.ALL})
  }
  
  static port: number | string;

  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
