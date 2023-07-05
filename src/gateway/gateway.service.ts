import { JwksClient } from 'jwks-rsa';
import {
  JwtHeader,
  SigningKeyCallback,
  decode as JwtDecode,
} from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket } from './interfaces/AuthenticationSocket.interface';

@Injectable()
export class GatewayService {
  constructor(private configService: ConfigService) {}
  client = new JwksClient({
    jwksUri: `${this.configService.get('API_DOMAIN')}/auth/jwt/jwks.json`,
  });
  getKey(header: JwtHeader, callback: SigningKeyCallback) {
    this.client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  }

  async decodeToken(socket: AuthenticatedSocket) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const result = await JwtDecode(socket.handshake.query.token as string);
      socket.userId = result['sub'] as string;
    }
  }
}
