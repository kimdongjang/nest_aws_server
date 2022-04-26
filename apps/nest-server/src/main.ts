import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { setupSwagger } from './config/swagger.config';
import { LoggerMiddleware } from './logger.middleware';

dotenv.config({
    path: path.resolve(
        (process.env.NODE_ENV === 'production') ? '.production.env' : '.development.env'
    )
})

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // swagger 등록
    setupSwagger(app);
    // 전역으로 Guard를 적용하려면
    //app.useGlobalGuards(new AuthGuard());

    await app.listen(4939);
}
bootstrap();
