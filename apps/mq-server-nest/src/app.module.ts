import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathController } from './math/math.controller';
import { MathModule } from './math/math.module';

@Module({
  imports: [MathModule],
  controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
