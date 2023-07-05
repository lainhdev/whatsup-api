import { Conversation, Friend } from '@prisma/client';

export interface IConversationPayload extends Conversation {
  createdBy: Friend;
}
