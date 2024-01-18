import type { z } from 'zod';
import { ZodError } from 'zod';

import { tryCatchAsync } from '../functional/try-catch.ts';
import type { HandledError } from '../types/error.js';
import type { ZodValidator } from '../types/zod-validator.js';

export async function parseJson<Z extends ZodValidator>(
  response: Response,
  responseSchema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  const unparsed = await tryCatchAsync(() => {
    return response.json();
  });

  if (!unparsed.isSuccess) {
    const { error, isSuccess } = unparsed;

    if (error instanceof ZodError) {
      return {
        error,
        isSuccess,
      };
    }

    return {
      error: new Error('failed to parse json'),
      isSuccess,
    };
  }

  const parsed = responseSchema.safeParse(unparsed);

  if (!parsed.success) {
    return {
      error: parsed.error,
      isSuccess: parsed.success,
    };
  }

  return { data: parsed.data, isSuccess: parsed.success };
}
