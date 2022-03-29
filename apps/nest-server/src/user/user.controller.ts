import {Controller, Get} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Controller('user')
export class UserController {
    constructor(private readonly emailService: EmailService){}

    @Get('/signin')
    async signin() {
        await this.emailService.sendTo('v.hzent@gmail.com');
        return 'signin';
    }
}
