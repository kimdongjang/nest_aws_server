import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'hello' })
  hello(input?: string): string {
    return `Hello, ${input || 'there'}!`;
  }
}