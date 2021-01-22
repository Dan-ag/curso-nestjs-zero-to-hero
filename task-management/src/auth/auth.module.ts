import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import * as config from 'config';

const jwConfig = config.get( 'jwt' );

@Module( {
  imports: [
    PassportModule.register( { defaultStrategy: 'jwt' } ),
    JwtModule.register( {
      secret: process.env.JWT_SECRET || jwConfig.secret,
      signOptions: {
        expiresIn: jwConfig.expiresIn
      }
    } ),
    TypeOrmModule.forFeature( [ UserRepository ] )
  ],
  controllers: [ AuthController ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
    PassportModule
  ]
} )
export class AuthModule { }
