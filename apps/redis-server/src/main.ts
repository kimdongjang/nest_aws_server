import { NestMicroserviceOptions } from "@nestjs/common/interfaces/microservices/nest-microservice-options.interface";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

// // Create new logger instance
// const logger = new Logger("Main");

// // Create micro service options
// const microserviceOptions = {
//   name: "BOOK_SERVICE",
//   transport: Transport.REDIS,
//   options: {
//     url: "redis://localhost:6379",
//   },
// };

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
//   app.listen();
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
