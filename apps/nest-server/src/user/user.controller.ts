import {Controller, Get, Post} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Controller('user')
export class UserController {
    constructor(private readonly emailService: EmailService){}

    @Get('/sendEmail')
    async signin() {
        await this.emailService.sendTo('naru3644@gmail.com');
        return 'signin';
    }
}
