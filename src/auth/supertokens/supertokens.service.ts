import { Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import Passwordless from 'supertokens-node/recipe/passwordless';
import Dashboard from 'supertokens-node/recipe/dashboard';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupertokensService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    supertokens.init({
      appInfo: {
        appName: configService.get('APP_NAME'),
        apiDomain: configService.get('API_DOMAIN'),
        websiteDomain: configService.get('WEBSITE_DOMAIN'),
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
      supertokens: {
        connectionURI: configService.get('SUPERTOKENS_CONNECTION_URI'),
        apiKey: configService.get('SUPERTOKENS_API_KEY'),
      },
      recipeList: [
        Passwordless.init({
          flowType: 'USER_INPUT_CODE',
          contactMethod: 'EMAIL',
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                consumeCodePOST: async (input) => {
                  if (originalImplementation.consumeCodePOST === undefined) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation of consumeCodePOST.
                  const response = await originalImplementation.consumeCodePOST(
                    input,
                  );

                  // Post sign up response, we check if it was successful
                  if (response.status === 'OK') {
                    const { id, email } = response.user;

                    if (response.createdNewUser) {
                      // TODO: post sign up logic
                      const nickname = response.user.email?.split('@')[0];
                      const picture = `/avatar/${
                        Math.floor(Math.random() * 12) + 1
                      }.png`;
                      await prisma.user.create({
                        data: {
                          nickname,
                          email,
                          id,
                          picture,
                        },
                      });
                    } else {
                      // TODO: post sign in logic
                    }
                  }
                  return response;
                },
              };
            },
          },
        }),
        Session.init({
          exposeAccessTokenToFrontendInCookieBasedAuth: true,
        }),
        Dashboard.init(),
      ],
    });
  }
}
