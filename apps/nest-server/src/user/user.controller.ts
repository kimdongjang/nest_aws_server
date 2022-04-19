import {Controller, Get, Param, Post, Query, Redirect, Req} from '@nestjs/common';
import { Request } from 'express';
import { EmailService } from 'src/email/email.service';

@Controller('user')
export class UserController {
    constructor(private readonly emailService: EmailService){}

    @Get('/sendEmail')
    async signin() {
        await this.emailService.sendTo('naru3644@gmail.com');
        return 'signin';
    }

    // 기본 get. 요청받은 정보를 request로 확인할 수 있음
    @Get()
    findAll(@Req() request: Request): string{
        return 'this action returns all cats' + request.ip;
    }
    
    @Get('/:id')
    getOne(@Param('id') movieId: string): string {
        return `this will return one movie, id: ${movieId}`;
    }

    // redirect 주소 넘겨주기.
    @Get('redirect')
    @Redirect('https://nestjs.com', 301)
    redirect(@Query('version') version){
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }
}
