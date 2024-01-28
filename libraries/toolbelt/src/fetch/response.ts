import type { z } from 'zod';

import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';
import { parseFetchJson } from './json.ts';

export async function parseResponseJson<Z extends ZodValidator>(
  response: Response,
  responseSchema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  return parseFetchJson(response, responseSchema);
}
