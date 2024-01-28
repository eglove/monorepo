import type { z } from 'zod';

import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export function parseJson<Z extends ZodValidator>(
  text: string,
  validator: Z,
  reviver?: (this: unknown, key: string, value: unknown) => unknown,
): HandledError<z.output<Z>, z.ZodError<Z> | Error> {
  const unparsed = validator.safeParse(JSON.parse(text, reviver));

  if (!unparsed.success) {
    return { error: unparsed.error, isSuccess: false };
  }

  return { data: unparsed.data, isSuccess: true };
}
