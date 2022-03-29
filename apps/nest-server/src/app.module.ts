import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './EmailService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import path from 'path';

@Module({
  // imports: [
  //   MailerModule.forRoot({
  //     transport: 'smtps://smtp.gmail.com:naru3644@gmail.com',
  //     defaults: {
  //       from: '"nest-modules" <modules@nestjs.com>',
  //     },
  //     template: {
  //       dir: __dirname + '/templates',
  //       adapter: new HandlebarsAdapter(),
  //       options: {
  //         strict: true,
  //       },
  //     },
  //   }),
  // ],
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEmail],
    }),
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config: ConfigService) => {
        console.log("=== write [.env] by config: netwoork ===")
        console.log(config.get('email'));
        return {
          ...config.get('email'),
          template:{
            dir: path.join(__dirname + '/templates/'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          }
        }
      }
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule { }
