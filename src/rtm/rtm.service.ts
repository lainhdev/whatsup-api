import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtmRole, RtmTokenBuilder } from 'agora-access-token';

@Injectable()
export class RtmService {
  constructor(private configService: ConfigService) {}

  generateRtmToken(uid: string, expiry: string) {
    // get uid
    if (!uid || uid === '') {
      throw new BadRequestException('uid is required');
    }
    // get role
    const role = RtmRole.Rtm_User;
    // get the expire time
    let expireTime: number | string = expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token

    const APP_ID = this.configService.get('AGORA_APP_ID');
    const APP_CERTIFICATE = this.configService.get('AGORA_APP_CERTIFICATE');
    console.log(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    const token = RtmTokenBuilder.buildToken(
      APP_ID,
      APP_CERTIFICATE,
      uid,
      role,
      privilegeExpireTime,
    );
    // return the token
    return { rtmToken: token };
  }
}
