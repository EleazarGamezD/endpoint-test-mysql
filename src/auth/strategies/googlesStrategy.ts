import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { o2AuthService } from '../auth-o2auth.service';
import { CreateUserDto } from '../dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  
  private readonly logger = new Logger(GoogleStrategy.name)

  constructor(
    @Inject('AUTH_SERVICE') private readonly oauthService: o2AuthService,   
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback, //eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    this.logger.log('GoogleStrategy', profile);

    const createUserDto: CreateUserDto = {
      email: profile.emails[0].value,
      fullName: profile.displayName,
    };

    const user = await this.oauthService.validateUser(createUserDto);
    return user;
  }
}
