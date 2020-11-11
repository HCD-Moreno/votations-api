import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from './../../config/config.service';
import { ConfigModule } from './../../config/config.module';
import { Configuration } from './../../config/config.keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get(Configuration.JWT_SECRET),
          signOptions: {
            expiresIn: 36000,
          },
        };
      },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [PassportModule, AuthModule, AuthService],
})
export class AuthModule {}
