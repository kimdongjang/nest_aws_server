import { MailerService } from '@nestjs-modules/mailer';
import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // 생성자
  constructor(private readonly mailerService: MailerService) { }

  async sendMail(config) {
    await this.mailerService.sendMail(config);
    //함수뒤에 then , catch함수등을 작성할 수 있다.
    return true;
  }

  async mailConfig(email) {
    return {
      to: 'naru3644@gmail.com',
      from: 'hello_dev@develop.com',
      subject: '안녕하세요',
      html: '<h1>안녕하세요</h1>',
      text: 'text',
    };
  }

  public test(): void {
    this.mailerService
      .sendMail({
        to: 'naru3644@gmail.com',
        from: 'hello_dev@develop.com',
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => { })
      .catch((err) => {console.log(err) });
  }
}
