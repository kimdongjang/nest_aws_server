import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    // passport-local strategy를 채택하도록 하고, Passport가 validate()메서드를 통해 자동으로 user object를 생성하고 Request object에 이를 할당해준다.
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req){ 
        return req.user;
    }

    @UseGuards(LocalAuthGuard)
    @Post('/alogin')
    async alogin(@Request() req){
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req){
        return req.user;
    }

}
