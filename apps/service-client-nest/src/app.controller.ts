import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

/**
 * app.module의 provider에서 Client Proxy 인스턴스를 생성했으므로 아래 컨트롤러에서 프록시 메서드를 사용하면서 설정한다.
 */
@Controller('hello')
export class AppController {
  /**
   * 클라이언트 프록시의 인스턴스를 컨트롤러에 주입함.
   * @param client
   */
  constructor(@Inject('HELLO_SERVICE') private client: ClientProxy) {}

  @Get(':name')
  getHelloByName(@Param('name') name = 'there') {
    // Forwards the name to our hello service, and returns the results
    console.log(name);
    return this.client.send({ cmd: 'hello' }, name);
  }
}
