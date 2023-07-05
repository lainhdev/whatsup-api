import { GatewayModule } from './../gateway/gateway.module';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';

@Module({
  imports: [GatewayModule],
  providers: [EventService],
})
export class EventModule {}
