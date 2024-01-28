import { isNil } from '../is/nil.ts';
import type { HandledError } from '../types/error.ts';

export function getCookieValue(
  cookieName: string,
  cookieSource: Headers | string,
): HandledError<string, Error> {
  const cookies =
    typeof cookieSource === 'string'
      ? cookieSource
      : cookieSource.get('Cookie');

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
