import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendModule } from './friend/friend.module';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { EventModule } from './event/event.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RtcModule } from './rtc/rtc.module';
import { RtmModule } from './rtm/rtm.module';

@Module({
  imports: [
    AuthModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FriendModule,
    UserModule,
    ConversationModule,
    MessageModule,
    GatewayModule,
    RtcModule,
    RtmModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
