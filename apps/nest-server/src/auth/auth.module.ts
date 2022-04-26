import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './passsport/constatns';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './passsport/jwt-auth.guard';
import { GoogleStrategy } from './passsport/google.strategy';
import { JwtStrategy } from './passsport/jwt.strategy';
import { LocalStrategy } from './passsport/local.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    UsersModule,
    PassportModule,  
    JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s'},
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
