import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { delay, of } from 'rxjs';
import { AppService } from './app.service';

/**
 * MSA의 기본적인 작동 방법을 테스트하기 위한 컨트롤러
 * Nest는 기본적으로 Response - Request 메시지 유형을 활성화하기 위해 두 개의 논리적 채널을 생성함
 * 한 채널은 데이터 전송을 담당하고, 다른 하나는 수신응답을 대기함.
 * 이와 같은 요청 - 응답을 사용하려면 @MessagePattern()을 사용함
 */
@Controller()
export class AppController {
  /**
   * hello라는 메시지를 수신함(cmd : 'hello')
   * @param input
   * @returns
   */
  @MessagePattern({ cmd: 'hello' })
  hello(input?: string): string {
    return `Hello, ${input || 'there'}!`;
  }

  @MessagePattern({ cmd: 'ping' })
  ping(_: any) {
    return of('pong').pipe(delay(0));
  }

  /**
   * 이벤트 기반(응답을 기다리지 않고 이벤트를 게시하는 경우에 사용)
   * 만약 시스템의 아래와 같은 부분에서 특정 조건이 발생했음을 다른 서비스에 알리고 싶을때 사용함.
   * 아래는 user_created라는 이벤트가 발생되었을 때 트리거됩니다.
   * @param data
   */
  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    // business logic
  }
}
