import { isNil } from 'lodash';

import type { HandledError } from '../types/error.js';

export function getCookieValue(
  cookieName: string,
  requestHeaders: Headers,
): HandledError<string, Error> {
  const cookies = requestHeaders.get('Cookie');

  if (isNil(cookies)) {
    return { error: new Error('cookies not found'), isSuccess: false };
  }

  const cookieArray = cookies.split(';');
  for (const cookie of cookieArray) {
    const [name, value] = cookie.split('=');

    if (name.trim() === cookieName.trim()) {
      return { data: value.trim(), isSuccess: true };
    }
  }

  return { error: new Error('failed to get cookie'), isSuccess: false };
}
