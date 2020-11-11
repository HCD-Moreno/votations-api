import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './../../user/user.entity';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext): UserEntity => {
    let req = null;

    if (context.getType() == 'ws') {
      req = context.switchToWs().getData().user;
    } else if (context.getType() == 'http') {
      req = context.switchToHttp().getRequest().user;
    }
    return req;
  },
);
