import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as path from "path";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { setupSwagger } from "./config/swagger.config";
import { LoggerMiddleware } from "./logger.middleware";
import cookieParser from "cookie-parser";

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === "production" ? ".production.env" : ".development.env"),
});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: 50001,
    },
  });
  await app.listen();
  // const app = await NestFactory.create(AppModule);
  // // swagger 등록
  // setupSwagger(app);
  // // Cookie Parser 사용
  // app.use(cookieParser());
  // // 전역으로 Guard를 적용하려면
  // //app.useGlobalGuards(new AuthGuard());

  // await app.listen(4939);
}
bootstrap();
