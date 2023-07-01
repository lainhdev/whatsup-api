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

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  @UseGuards(new AuthGuard())
  create(@Body('email') email: string, @Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.friendService.create(userId, email);
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
  update(@Param('id') id: string, @Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.friendService.update(id, userId);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  remove(@Session() session: SessionContainer, @Param('id') id: string) {
    const userId = session.getUserId();
    return this.friendService.remove(id, userId);
  }
}
