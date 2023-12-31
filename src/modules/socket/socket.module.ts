import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.service';
// import { WebSocketGatewayController } from './websocket.controller';

@Module({
  imports: [],
  providers: [SocketGateway],
})
export class SocketModule { }