import { Controller, Get } from '@nestjs/common';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';

/**
 * rxjs를 사용한 이벤트 스트림(시간에 따른 스트림) 비동기 처리
 * rxjs는 이벤트 스트림을 Observabale이라는 객체로 표현한 후 비동기 이벤트 기반의 프로그래밍을 진행
 * Observer : 이벤트 핸들러(버튼 클릭을 구독하는 addEventListener와 같은)
 * Observabale: 특정 객체를 관찰하는 Observer에게 여러 이벤트가 값을 보내는 역할을 함.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping-a')
  pingServiceA() {
    return this.appService.pingServiceA();
  }
  @Get('/ping-b')
  pingServiceB() {
    return this.appService.pingServiceB();
  }

  @Get('/ping-all')
  pingAll() {
    return zip(
      this.appService.pingServiceA(),
      this.appService.pingServiceB(),
    ).pipe(
      map(([pongServiceA, pongServiceB]) => ({
        pongServiceA,
        pongServiceB,
      })),
    );
  }
}
