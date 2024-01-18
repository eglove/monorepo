import type { z } from 'zod';

import { tryCatchAsync } from '../functional/try-catch.ts';
import type { HandledError } from '../types/error.ts';

export async function parseJson<Z extends z.ZodObject<z.ZodRawShape>>(
  response: Response,
  responseSchema: Z,
): Promise<HandledError<z.output<typeof responseSchema>, unknown>> {
  return tryCatchAsync(() => {
    return response.json();
  });
}
