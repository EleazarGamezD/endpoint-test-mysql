import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { o2AuthService } from '../auth-o2auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name)
  constructor(
    @Inject('AUTH_SERVICE') private readonly oauthService: o2AuthService,   
  ) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: Error | null, user: User | null) => void,
  ) {
    this.logger.log('SerializeUser', user);
    done(null, user);
  }

  async deserializeUser(
    payload: { id: string },
    done: (err: Error | null, user: User | null) => void,
  ) {
    const user = await this.oauthService.findUser(payload.id);
    this.logger.log('DeserializeUser', user);
    done(null, user);
  }
}
