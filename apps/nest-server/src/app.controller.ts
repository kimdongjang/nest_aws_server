import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/sendMail')
  async sendMail(@Param('email') email) {
    const config = this.mailService.mailConfig(email);
    const result = await this.mailService.sendMail(config);
    return result;
  }
}
