import { ConversationService } from './../conversation/conversation.service';
import { CreateFirstMessageDto } from './dto/create-first-message.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private event: EventEmitter2,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        text: createMessageDto.text,
        conversationId: createMessageDto.conversationId,
        authorId: createMessageDto.authorId,
      },
      include: {
        conversation: {
          include: {
            createdBy: {
              include: {
                receiver: true,
                sender: true,
              },
            },
          },
        },
      },
    });

    await this.conversationService.update(
      createMessageDto.conversationId,
      message.id,
    );
    return message;
  }

  async createFirstMessage(
    createFirstMessageDto: CreateFirstMessageDto,
    authUserId: string,
  ) {
    const conversation = await this.conversationService.create(
      createFirstMessageDto.friendId,
    );
    this.event.emit('conversation.create', conversation);

    const createMessageDto: CreateMessageDto = {
      text: createFirstMessageDto.text,
      conversationId: conversation.id,
      authorId: authUserId,
    };

    const message = await this.create(createMessageDto);
    this.event.emit('message.create', message);
    return { conversation, message };
  }

  loadMoreMessages(conversationId: string, messageId: string) {
    console.log({ conversationId, messageId });
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      cursor: {
        id: messageId,
      },
      skip: 1,
      take: 10,
      include: {
        conversation: {
          include: {
            createdBy: {
              include: {
                receiver: true,
                sender: true,
              },
            },
          },
        },
      },
    });
  }
}
