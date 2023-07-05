import { Controller, Get, Param, Query } from '@nestjs/common';
import { RtmService } from './rtm.service';

@Controller('rtm')
export class RtmController {
  constructor(private readonly rtmService: RtmService) {}

  @Get(':uid')
  findOne(@Param('uid') uid: string, @Query('expiry') expiry: string) {
    return this.rtmService.generateRtmToken(uid, expiry);
  }
}
