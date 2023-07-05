import { AuthGuard } from './../auth/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Session,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @UseGuards(new AuthGuard())
  create(@Body('friendId') friendId: string) {
    return this.conversationService.create(friendId);
  }

  @Get()
  @UseGuards(new AuthGuard())
  findAll(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.conversationService.findAll(userId);
  }

  @Delete()
  @UseGuards(new AuthGuard())
  delete(@Body('conversationId') conversationId: string) {
    return this.conversationService.remove(conversationId);
  }
}
