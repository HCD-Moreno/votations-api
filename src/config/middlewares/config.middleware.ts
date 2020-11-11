import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserEntity } from '../../modules/user/user.entity';
import { Configuration } from '../config.keys';
import { ConfigService } from '../config.service';


@Injectable()
export class ConfigMiddleware implements NestMiddleware {
    constructor(private config: ConfigService){}

    use(req: Request, res: Response, next: Function) {
        if(!UserEntity.uploadsURL ){
            UserEntity.uploadsURL = req.get('host');
        }
        next();
    }
}
