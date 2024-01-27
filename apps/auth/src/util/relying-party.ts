export function relyingParty(url: URL) {
  const rpID = url.hostname;
  const expectedOrigin = `${url.protocol}://${url.hostname}`;

  return {
    expectedOrigin,
    rpID,
    rpName: 'ethang',
  };
}
