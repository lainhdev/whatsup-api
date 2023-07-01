import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(new AuthGuard())
  findOne(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return this.userService.findOne(userId);
  }

  @Patch()
  @UseGuards(new AuthGuard())
  update(
    @Session() session: SessionContainer,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = session.getUserId();
    return this.userService.update(userId, updateUserDto);
  }
}
