import type { RequestHandler } from '@builder.io/qwik-city';
import lodash from 'lodash';

import { prisma } from '../../../clients/prisma';

// @ts-expect-error// keep this unused
export const onGet: RequestHandler = async ({ json }) => {
  const record = await prisma.jWKS.findFirst({
    select: { publicKey: true },
  });

  if (lodash.isNil(record)) {
    return json(404, { error: 'Not Found' });
  }

  json(200, JSON.parse(record.publicKey));
};
