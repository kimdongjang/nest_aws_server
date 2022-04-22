import {Body, Controller, Get, Param, Post, Query, Redirect, Req} from '@nestjs/common';
import { Request } from 'express';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ){}

    @Get('/sendEmail')
    async signin() {
        await this.emailService.sendTo('naru3644@gmail.com');
        return 'signin';
    }

    // 기본 get. 요청받은 정보를 request로 확인할 수 있음
    @Get()
    findAll(): Promise<UserEntity[]>{
        return this.userService.findAll();
    }
    

    // redirect 주소 넘겨주기.
    @Get('redirect')
    @Redirect('https://nestjs.com', 301)
    redirect(@Query('version') version){
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }
    @Post('/createuser')
    async create(@Body() userData: CreateUserDto): Promise<UserEntity>{
        return await this.userService.create(userData);
    }
}
