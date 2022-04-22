import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.resolve(
        (process.env.NODE_ENV === 'production') ? '.production.env' : '.development.env'
    )
})

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(4939);
}
bootstrap();
