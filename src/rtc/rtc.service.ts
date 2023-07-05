import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Injectable()
export class RtcService {
  constructor(private configService: ConfigService) {}
  generateRtcToken(
    uid: string,
    channelName: string,
    role: string,
    tokentype: string,
    expiry: string,
  ) {
    if (!channelName) {
      throw new BadRequestException('Channel is required');
    }
    //get uid
    if (!uid || uid === '') {
      uid = '0';
    }
    //get role
    if (role === 'publisher') {
      role = RtcRole.PUBLISHER.toString();
    }
    //get the expire time
    let expireTime: number | string = expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    //calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    //build the token
    let token: any;
    const APP_ID = this.configService.get('AGORA_APP_ID');
    const APP_CERTIFICATE = this.configService.get('AGORA_APP_CERTIFICATE');
    if (tokentype === 'userAccount') {
      token = RtcTokenBuilder.buildTokenWithAccount(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        Number(role),
        privilegeExpireTime,
      );
    } else if (tokentype === 'uid') {
      token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        Number(uid),
        Number(role),
        privilegeExpireTime,
      );
    } else {
      throw new BadRequestException('token type is invalid');
    }
    return { rtcToken: token };
  }
}
