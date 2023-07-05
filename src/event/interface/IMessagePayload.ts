import { Message } from '@prisma/client';
import { IConversationPayload } from './IConversationPayload';

export interface IMessagePayload extends Message {
  conversation: IConversationPayload;
}
