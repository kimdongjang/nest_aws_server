import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { MATH_SERVICE } from './math.constants';

@Controller('math')
export class MathController {
  // 클라이언트 Nest 애플리케이션은 클래스를 사용하여 Nest 마이크로서비스에 메시지를 교환하거나 이벤트를 게시하는 ClientProxy를 주입
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  execute(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, data);
  }

  /**
   * message handler
   * @param data 클라이언트에서 전달된 단일 인수를 사용
   * @returns
   */
  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  /**
   * rxjs를 사용
   * @param data 데이터 스트림이 완료될 때까지
   * @returns
   */
  // @MessagePattern({ cmd: 'sum' })
  // accumulate(data: number[]): Observable<number> {
  //     return from([1, 2, 3]);
  // }

  @MessagePattern('time.us.*')
  getDate(@Payload() data: number[], @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`); // e.g. "time.us.east"
    return new Date().toLocaleTimeString();
  }
}
