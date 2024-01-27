import { HTTP_STATUS } from '@ethang/toolbelt/constants/http';
import { tryCatchAsync } from '@ethang/toolbelt/functional/try-catch';
import type Prisma from '@prisma/client';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';
import { isNil } from 'lodash';
import { z } from 'zod';

import { database } from '../../database/prisma-client.ts';
import type { AstroRequest } from '../../types/astro.ts';
import { standardResponse } from '../../types/response.ts';
import { relyingParty } from '../../util/relying-party.ts';

const registerStartRequestSchema = z.object({
  username: z.string(),
});

export async function POST(parameters: AstroRequest) {
  const body = registerStartRequestSchema.safeParse(
    await parameters.request.json(),
  );

  if (!body.success) {
    return new Response(JSON.stringify(body.error.formErrors), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const { username } = body.data;

  const userResult = await tryCatchAsync(() => {
    return database.user.findUnique({
      select: {
        Authenticators: true,
        id: true,
        username: true,
      },
      where: { username },
    });
  });

  if (!userResult.isSuccess || isNil(userResult.data)) {
    return standardResponse(null, [{ user: 'user not found' }], {
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const { rpID, rpName } = relyingParty(parameters.url);
  const user = userResult.data;

  const options = await generateRegistrationOptions({
    attestationType: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    excludeCredentials: user.Authenticators.map(
      (authenticator: Prisma.Authenticator) => {
        return {
          id: authenticator.credentialId as unknown as BufferSource,
          transports:
            authenticator.transports as AuthenticatorTransportFuture[],
          type: 'public-key',
        };
      },
    ),
    rpID,
    rpName,
    userID: user.id,
    userName: user.username,
  });

  const updateResult = await tryCatchAsync(() => {
    return database.user.update({
      data: { currentChallenge: options.challenge },
      select: { id: true },
      where: { username: user.username },
    });
  });

  if (!updateResult.isSuccess) {
    return standardResponse(
      null,
      [{ user: 'failed to update authentication' }],
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }

  return standardResponse(options, null, { status: HTTP_STATUS.OK });
}
