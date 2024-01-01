export async function hashString(value: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const buffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buffer)]
    .map(byte => {
      return byte.toString(16).padStart(2, '0');
    })
    .join('');
}
