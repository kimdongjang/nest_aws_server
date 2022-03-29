import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './EmailService';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService) { }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get('/sendMail')
  async sendMail(@Param('email') email) {
    const config = this.emailService.mailConfig(email);
    console.log(config)
    const result = await this.emailService.sendMail(config);
    console.log(result)
    return result;
  }
}
