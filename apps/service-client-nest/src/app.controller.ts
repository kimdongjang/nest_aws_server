import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('hello')
export class AppController {
  constructor(@Inject('HELLO_SERVICE') private client: ClientProxy) { }

  @Get(':name')
  getHelloByName(@Param('name') name = 'there') {
    // Forwards the name to our hello service, and returns the results
    return this.client.send({ cmd: 'hello' }, name);
  }
}
