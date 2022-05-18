import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { MATH_SERVICE } from './math.constants';
import { MathController } from './math.controller';

@Module({
    imports: [
        // name 속성은 필요한 곳에 인스턴스를 주입하는데 사용할 수 있는 토큰 역할
        ClientsModule.register([{ name: MATH_SERVICE, transport: Transport.TCP }]),
    ],
    controllers: [MathController],
})
export class MathModule { }
