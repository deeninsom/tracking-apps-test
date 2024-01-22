// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: true, namespace: "/api/socket" })
// export class SocketGateway {
//   @WebSocketServer() server: Server;

//   private userLocations: Record<string, any> = {};

//   handleConnection(client: Socket): void {
//     console.log('A user connected');

//     if (client.handshake.auth.userId) {
//       const initialLocation = client.handshake.auth.location;
//       if (initialLocation) {
//         this.userLocations[client.id] = initialLocation;
//         this.server.emit('locationUpdate', { id: client.id, location: initialLocation });
//       }
//     }

//     client.on('locationUpdate', (location: any) => {
//       console.log('Received location update:', location);

//       this.userLocations[client.id] = location;

//       client.broadcast.emit('locationUpdate', { id: client.id, location });
//     });

//   }

//   handleDisconnect(client: Socket): void {
//     console.log('User disconnected');

//     delete this.userLocations[client.id];

//     this.server.emit('userDisconnected', client.id);
//   }
// }
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';


@WebSocketGateway(3026, { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('SocketGateway');

  afterInit(server: any) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    let serverUrl = client.handshake.url;
    serverUrl = serverUrl.replace(/^http/, 'ws');
    this.logger.log(`WebSocket Server URL: ${serverUrl}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}