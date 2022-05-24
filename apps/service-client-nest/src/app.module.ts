import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  /**
   * 아래를 import함으로 ConfigService 애플리케이션을 모듈 전체에서 활용할 수 있게 됨.
   */
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
    }),
  ],
  controllers: [AppController],
  /**
   * 다른 마이크로 서비스를 호출할 수 있는 서비스를 생성하기 위해 provider에 ClientProxyFactory를 등록함.
   */
  providers: [
    {
      provide: 'HELLO_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('HELLO_SERVICE_HOST'),
            port: configService.get('HELLO_SERVICE_PORT'),
          },
        }),
    },
  ],
})
export class AppModule {}
