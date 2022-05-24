import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_A') private readonly clientServiceA: ClientProxy,
  ) {}

  pingServiceA() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.clientServiceA.send<string>(pattern, payload).pipe(
      map((message: string) => ({
        message,
        duration: (Date.now() - startTs) / 1000,
      })),
    );
  }
}
