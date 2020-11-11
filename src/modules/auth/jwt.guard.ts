import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service';
import { UserEntity } from './../user/user.entity';
import { ConfigService } from './../../config/config.service';
import { Configuration } from './../../config/config.keys';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isWs = Boolean(context.getType() == 'ws');

    const token = this.getToken(context);

    let verifyToken;

    try {
      verifyToken = jwt.verify(
        token,
        this._configService.get(Configuration.JWT_SECRET),
      );
    } catch {
      this.Unauthorized(isWs);
    }

    const jwtPayload: IJwtPayload = <IJwtPayload>verifyToken;
    const user: UserEntity = await this._authService.validateUser(jwtPayload);

    if (!user) {
      this.Unauthorized(isWs);
    }
    this.setRequest(context, user);
    return Boolean(user);
  }

  getToken(context: ExecutionContext): string {
    let query: string = '';

    if (context.getType() == 'ws') {
      const client = context.switchToWs().getClient();
      query = client.handshake.query.Authorization;

      if (!query) {
        throw new WsException('bad request, no data in Authorization');
      }
    } else if (context.getType() == 'http') {
      query = context.switchToHttp().getRequest().headers.authorization;

      if (!query) {
        throw new BadRequestException('Authorization is empty');
      }
    }

    const token = query.split(' ');

    return token[1];
  }

  setRequest(context: ExecutionContext, user: UserEntity) {
    if (context.getType() == 'ws') {
      const data = context.switchToWs().getData();
      context.switchToWs().getData().user = user;
    } else if (context.getType() == 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }

  Unauthorized(isWs: boolean) {
    if (isWs) {
      throw new WsException({
        status: 'Unauthorized',
        message: 'Invalid token.',
      });
    } else {
      throw new UnauthorizedException();
    }
  }
}
