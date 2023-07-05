import { MessageService } from './../message/message.service';
import { CreateMessageDto } from './../message/dto/create-message.dto';
import { ConversationService } from './../conversation/conversation.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';
import { GatewaySessionManager } from './gateway.session';
import { AuthenticatedSocket } from './interfaces/AuthenticationSocket.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gatewayService: GatewayService,
    private conversationService: ConversationService,
    private messageService: MessageService,
    readonly sessions: GatewaySessionManager,
  ) {}
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('afterInit');
    //Do stuffs
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`Disconnected: ${socket.id}`);
    this.sessions.removeUserSocket(socket.userId);
    //Do stuffs
  }

  async handleConnection(socket: AuthenticatedSocket) {
    console.log(`Connected ${socket.id}`);
    //Do stuffs
    await this.gatewayService.decodeToken(socket);
    this.sessions.setUserSocket(socket.userId, socket);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    console.log('sendMessage');
    data.authorId = socket.userId;
    const message = await this.messageService.create(data);
    this.server
      .to(`conversation-${message.conversationId}`)
      .emit('onReceivedMessage', message);
  }

  @SubscribeMessage('gettingOnline')
  async gettingOnline(@ConnectedSocket() socket: AuthenticatedSocket) {
    const conversations = await this.conversationService.findAll(socket.userId);
    conversations.forEach((conversation) => {
      console.log('conversation ', conversation.id);
      socket.join(`conversation-${conversation.id}`);
    });
  }

  @SubscribeMessage('callingRequest')
  callingRequest(
    @MessageBody() data: { conversationId: string; targetUserId: string },
  ) {
    const receiverSocket = this.sessions.getUserSocket(data.targetUserId);
    receiverSocket.emit('onReceivedCallingRequest', data.conversationId);
  }

  @SubscribeMessage('cancelCall')
  cancelCall(@MessageBody() targetUserId: string) {
    const receiverSocket = this.sessions.getUserSocket(targetUserId);
    receiverSocket.emit('onCancelCall');
  }
}
