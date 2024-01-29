import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as chalk from 'chalk';

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  namespace: "/api/socket",
  transports: ['websocket']
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private userLocations: Record<string, any> = {};
  private logger: Logger = new Logger('SocketGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(chalk.yellowBright(`Socket is connected: ${client.id}`));

    // Additional code for handling connections, if needed
  }
}

// client.on('send-locations', (data: any) => {
//   this.server.emit('received-locations', {data});
// });


// @SubscribeMessage('message')
// socketGetUsers(client: any, payload: any): string {
//   console.log(payload)
//   return 'Hello world!';
// }

// handleConnection(client: Socket): void {
//   console.log('A user connected');

//   if (client.handshake.auth.userId) {
//     const initialLocation = client.handshake.auth.location;
//     if (initialLocation) {
//       this.userLocations[client.id] = initialLocation;
//       this.server.emit('locationUpdate', { id: client.id, location: initialLocation });
//     }
//   }

//   client.on('locationUpdate', (location: any) => {
//     console.log('Received location update:', location);

//     this.userLocations[client.id] = location;

//     client.broadcast.emit('locationUpdate', { id: client.id, location });
//   });

// }

// handleDisconnect(client: Socket): void {
//   console.log('User disconnected');

//   delete this.userLocations[client.id];

//   this.server.emit('userDisconnected', client.id);
// }


// import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import * as chalk from 'chalk';


// @WebSocketGateway({ cors: { origin: '*' } })
// export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   private logger: Logger = new Logger('SocketGateway');
//   private connectedClients: Set<string> = new Set();

//   afterInit() {
//     this.logger.log('WebSocket Gateway initialized');
//   }

//   handleConnection(client: any, ...args: any[]) {
//     this.logger.log(chalk.yellowBright(`Client connected: ${client.id}`));
//     this.connectedClients.add(client.id);
//     this.logger.log(chalk.yellowBright(`Total Connected Clients: ${this.connectedClients.size}`));
//   }

//   handleDisconnect(client: any) {
//     this.logger.log(chalk.red(`Client disconnected: ${client.id}`));
//     this.connectedClients.delete(client.id);
//     this.logger.log(chalk.red(`Total Connected Clients: ${this.connectedClients.size}`));
//   }

//   @SubscribeMessage('users')
//   socketGetUsers(client: any, payload: any): string {
//     console.log(payload)
//     return 'Hello world!';
//   }

//   @SubscribeMessage('user-locations')
//   socketGetUserLocations(client: any, payload: any): string {
//     console.log(payload)
//     return 'Hello world!';
//   }
// }