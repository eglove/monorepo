import * as jose from 'jose';
import lodash from 'lodash';

import { prisma } from '../clients/prisma';

export async function createJwt(email: string) {
  const record = await prisma.jWKS.findFirst({
    select: { privateKey: true },
  });

  if (lodash.isNil(record)) {
    return;
  }

  const jwk = await jose.importJWK(JSON.parse(record.privateKey));

  return new jose.SignJWT({ email })
    .setProtectedHeader({ alg: 'PS256' })
    .setIssuedAt()
    .setExpirationTime('1y')
    .sign(jwk);
}

export async function rotateJwks() {
  const { publicKey, privateKey } = await jose.generateKeyPair('PS256');

  const publicJwk = await jose.exportJWK(publicKey);
  const privateJwk = await jose.exportJWK(privateKey);

  const record = await prisma.jWKS.findFirst({
    select: { id: true },
  });

  if (!lodash.isNil(record)) {
    await prisma.jWKS.update({
      data: {
        privateKey: JSON.stringify(privateJwk),
        publicKey: JSON.stringify(publicJwk),
      },
      where: { id: record.id },
    });
  }
}
