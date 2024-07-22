import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserDetails } from './entities/user-details.entity';
import {
  UserDetailRepository,
  UserRepository,
} from '../repositories/user-repository';
import { O2AuthController } from './auth-o2auth.controller';
import { o2AuthService } from './auth-o2auth.service';
import { GoogleStrategy } from './strategies/googlesStrategy';
import { SessionSerializer } from './strategies/serializer';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController, O2AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
    o2AuthService,
    { provide: 'AUTH_SERVICE', useClass: o2AuthService },
    UserRepository,
    UserDetailRepository,    
  ],
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([User, UserDetails]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
  ],

  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService,
    GoogleStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
