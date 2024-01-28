import type { z } from 'zod';

import { tryCatchAsync } from '../functional/try-catch.ts';
import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export async function parseFetchJson<Z extends ZodValidator>(
  value: Request | Response,
  schema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  const unparsed = await tryCatchAsync(() => {
    return value.json();
  });

  if (!unparsed.isSuccess) {
    return unparsed;
  }

  const parsed = schema.safeParse(unparsed);

  if (!parsed.success) {
    return {
      error: parsed.error,
      isSuccess: parsed.success,
    };
  }

  return { data: parsed.data, isSuccess: parsed.success };
}
