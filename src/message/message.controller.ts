import { AuthGuard } from 'src/auth/auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateFirstMessageDto } from './dto/create-first-message.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Post('firstMessage')
  @UseGuards(new AuthGuard())
  create(
    @Body() createFirstMessageDto: CreateFirstMessageDto,
    @Session() session: SessionContainer,
  ) {
    const authUserId = session.getUserId();
    return this.messageService.createFirstMessage(
      createFirstMessageDto,
      authUserId,
    );
  }

  @Get('loadMore')
  @UseGuards(new AuthGuard())
  loadMoreMessages(
    @Query('conversationId') conversationId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.messageService.loadMoreMessages(conversationId, messageId);
  }
}
