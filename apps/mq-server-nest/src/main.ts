import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

/**
 * 서버측 마이크로서비스
 */
async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 5672;
  // NestFactory.createMicroservice() 응용 프로그램이 응답하는 프로토콜 및 계약에 대한 추가 제어를 제공하는 방법을 사용
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000, port: port },
  });
  await app.listen();
  console.log(`Microservice Service_A is running on: ${port}`);

  // const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { retryAttempts: 5, retryDelay: 3000 },
  // });

  // await app.startAllMicroservices();
  // await app.listen(3001);
  // console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
