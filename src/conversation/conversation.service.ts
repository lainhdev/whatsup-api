import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}
  create(friendId: string) {
    return this.prisma.conversation.create({
      data: {
        friendId,
      },
      include: {
        createdBy: {
          include: {
            receiver: true,
            sender: true,
          },
        },
        lastMessage: true,
        messages: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.conversation.findMany({
      orderBy: {
        lastMessage: {
          createdAt: 'desc',
        },
      },
      where: {
        OR: [
          {
            createdBy: {
              receiverId: userId,
            },
          },
          {
            createdBy: {
              senderId: userId,
            },
          },
        ],
      },
      include: {
        createdBy: {
          include: {
            receiver: true,
            sender: true,
          },
        },
        lastMessage: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  update(conversationId: string, messageId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: {
          connect: {
            id: messageId,
          },
        },
      },
    });
  }

  remove(ConversationId: string) {
    return this.prisma.conversation.delete({
      where: { id: ConversationId },
    });
  }
}
