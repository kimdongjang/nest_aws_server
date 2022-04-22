import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passsport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req){}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req){
        return this.authService.googleLogin(req);
    }

    // 이름과 패스워드 받아서 로그인
    // auth 처리가 안되어있기 때문에 에러
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req){ 
        return req.user;
    }

    // passport-local strategy를 채택하도록 하고, Passport가 validate()메서드를 통해 자동으로 user object를 생성하고 Request object에 이를 할당해준다.
    // 이름과 패스워드 받아서 로그인
    @UseGuards(AuthGuard('local'))
    @Post('/alogin')
    async alogin(@Request() req){
        return this.authService.login(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req){
        return req.user;
    }

}
