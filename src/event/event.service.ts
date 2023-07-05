import { Gateway } from './../gateway/gateway';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Conversation, Friend, Message } from '@prisma/client';
import { IConversationPayload } from './interface/IConversationPayload';
import { IMessagePayload } from './interface/IMessagePayload';

@Injectable()
export class EventService {
  constructor(private readonly gateway: Gateway) {}
  @OnEvent('friend.create')
  friendCreate(payload: Friend) {
    console.log('friend.create');
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.receiverId,
    );
    receiverSocket && receiverSocket.emit('onFriendRequestReceived', payload);
  }

  @OnEvent('friend.update')
  friendUpdate(payload: Friend) {
    console.log('friend.update');
    const senderSocket = this.gateway.sessions.getUserSocket(payload.senderId);
    console.log(senderSocket.userId);
    senderSocket && senderSocket.emit('onFriendAccepted', payload);
  }

  @OnEvent('friend.delete')
  friendDelete(payload: Friend) {
    console.log('friend.delete');
    const senderSocket = this.gateway.sessions.getUserSocket(payload.senderId);
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.receiverId,
    );
    senderSocket && senderSocket.emit('onFriendDeleted', payload);
    receiverSocket && receiverSocket.emit('onFriendDeleted', payload);
  }

  @OnEvent('conversation.create')
  conversationCreate(payload: IConversationPayload) {
    console.log('conversation.create');
    const senderSocket = this.gateway.sessions.getUserSocket(
      payload.createdBy.senderId,
    );
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.createdBy.receiverId,
    );
    senderSocket && senderSocket.join(`conversation-${payload.id}`);
    receiverSocket && receiverSocket.emit(`conversation-${payload.id}`);

    this.gateway.server
      .to(`conversation-${payload.id}`)
      .emit('onNewConversation', payload);
  }

  @OnEvent('message.create')
  messageCreate(payload: IMessagePayload) {
    console.log('message.create');
    this.gateway.server
      .to(`conversation-${payload.conversationId}`)
      .emit('receivedMessage', payload);
  }
}
