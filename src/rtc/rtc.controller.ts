import { Controller, Get, Param, Query } from '@nestjs/common';
import { RtcService } from './rtc.service';

@Controller('rtc')
export class RtcController {
  constructor(private readonly rtcService: RtcService) {}

  @Get(':channelName/:role/:tokentype/:uid')
  findAll(
    @Param('uid') uid: string,
    @Param('channelName') channelName: string,
    @Param('role') role: string,
    @Param('tokentype') tokentype: string,
    @Query('expiry') expiry: string,
  ) {
    console.log({ expiry });
    return this.rtcService.generateRtcToken(
      uid,
      channelName,
      role,
      tokentype,
      expiry,
    );
  }
}
