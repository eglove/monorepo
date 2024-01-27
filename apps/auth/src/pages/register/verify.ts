import { HTTP_STATUS } from '@ethang/toolbelt/constants/http';
import { tryCatchAsync } from '@ethang/toolbelt/functional/try-catch';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { RegistrationResponseJSON } from '@simplewebauthn/types';

import type { AstroRequest } from '../../types/astro.ts';
import { standardResponse } from '../../types/response.ts';
import { relyingParty } from '../../util/relying-party.ts';

export async function POST(parameters: AstroRequest) {
  const body = (await parameters.request.json()) as RegistrationResponseJSON;

  const expectedChallenge = 'challenge';
  const { rpID, expectedOrigin } = relyingParty(parameters.url);

  const result = await tryCatchAsync(() => {
    return verifyRegistrationResponse({
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      response: body,
    });
  });

  if (!result.isSuccess) {
    return standardResponse(null, [{ registration: 'invalid credentials' }], {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  return standardResponse(result.data, null, { status: HTTP_STATUS.OK });
}
