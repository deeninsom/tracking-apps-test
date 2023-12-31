import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: {
  origin: ['https://deeninsom.github.io/'],
  credentials: true
}, namespace: "/api/socket" })
export class SocketGateway {
  @WebSocketServer() server: Server;

  private userLocations: Record<string, any> = {};

  handleConnection(client: Socket): void {
    console.log('A user connected');

    if (client.handshake.auth.userId) {
      const initialLocation = client.handshake.auth.location;
      if (initialLocation) {
        this.userLocations[client.id] = initialLocation;
        this.server.emit('locationUpdate', { id: client.id, location: initialLocation });
      }
    }

    client.on('locationUpdate', (location: any) => {
      console.log('Received location update:', location);

      this.userLocations[client.id] = location;

      client.broadcast.emit('locationUpdate', { id: client.id, location });
    });
    
  }

  handleDisconnect(client: Socket): void {
    console.log('User disconnected');

    delete this.userLocations[client.id];

    this.server.emit('userDisconnected', client.id);
  }
}
