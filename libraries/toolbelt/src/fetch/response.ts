import type { z } from 'zod';

import type { HandledError } from '../types/error.js';
import type { ZodValidator } from '../types/zod-validator.js';
import { parseFetchJson } from './json.js';

export async function parseResponseJson<Z extends ZodValidator>(
  response: Response,
  responseSchema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  return parseFetchJson(response, responseSchema);
}
