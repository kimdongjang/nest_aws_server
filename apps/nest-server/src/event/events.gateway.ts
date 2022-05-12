import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { map, from, Observable } from "rxjs";
import { Server } from "socket.io";


/**
 * 웹 소켓 게이트웨이 데코레이터에 연결할 포트 번호, 네임스페이스, transport 등을 설정할 수 있음
 * 게이트 웨이를 생성하면 이를 모듈에 등록할 수 있음
 */
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    // events 메시지를 구독할 경우, 클라이언트에게 값을 리턴
    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }
}