import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 클라이언트측 (마이크로서비스를 접근하기 위한)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5682);
}
bootstrap();
