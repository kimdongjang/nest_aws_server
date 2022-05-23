import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'cats_queue',
  //     queueOptions: {
  //       durable: false
  //     },
  //   },
  // });

  // app.listen();

  const port = process.env.PORT ? Number(process.env.PORT) : 5672;
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000, port: port },
  });
  await app.listen();
  console.log(`Application is running on: ${port}`);

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
