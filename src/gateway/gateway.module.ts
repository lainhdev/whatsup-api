import { ConversationModule } from 'src/conversation/conversation.module';
import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Gateway } from './gateway';
import { MessageModule } from 'src/message/message.module';
import { GatewaySessionManager } from './gateway.session';

@Module({
  imports: [MessageModule, ConversationModule],
  providers: [Gateway, GatewayService, GatewaySessionManager],
  exports: [Gateway, GatewaySessionManager],
})
export class GatewayModule {}
