import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as path from "path";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { setupSwagger } from "./config/swagger.config";
import { LoggerMiddleware } from "./logger.middleware";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === "production" ? ".production.env" : ".development.env"),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // swagger 등록
  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe());

  // Cookie Parser 사용
  app.use(cookieParser());
  // 전역으로 Guard를 적용하려면
  //app.useGlobalGuards(new AuthGuard());

  app.enableCors();

  await app.listen(4949);
}
bootstrap();
