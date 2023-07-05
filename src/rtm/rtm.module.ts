import { Module } from '@nestjs/common';
import { RtmService } from './rtm.service';
import { RtmController } from './rtm.controller';

@Module({
  controllers: [RtmController],
  providers: [RtmService],
})
export class RtmModule {}
