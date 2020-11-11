import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';
import { Configuration } from '../config/config.keys';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        type: 'mysql',
        host: config.get(Configuration.DATABASE_HOST),
        username: config.get(Configuration.DATABASE_USER),
        port: 3306,
        database: config.get(Configuration.DATABASE),
        password: config.get(Configuration.DATABASE_PASSWORD),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      } as ConnectionOptions;
    },
  }),
];
