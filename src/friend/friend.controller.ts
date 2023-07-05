import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Session,
  Patch,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private event: EventEmitter2,
  ) {}

  @Post()
  @UseGuards(new AuthGuard())
  async create(
    @Body('email') email: string,
    @Session() session: SessionContainer,
  ) {
    const userId = session.getUserId();
    const friend = await this.friendService.create(userId, email);
    this.event.emit('friend.create', friend);
    return friend;
  }

  @Get()
  @UseGuards(new AuthGuard())
  findAll(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.friendService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(new AuthGuard())
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(new AuthGuard())
  async update(@Param('id') id: string, @Session() session: SessionContainer) {
    const userId = session.getUserId();
    const friend = await this.friendService.update(id, userId);
    this.event.emit('friend.update', friend);
    return friend;
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async remove(@Session() session: SessionContainer, @Param('id') id: string) {
    const userId = session.getUserId();
    const friend = await this.friendService.remove(id, userId);
    this.event.emit('friend.delete', friend);
    return friend;
  }
}
