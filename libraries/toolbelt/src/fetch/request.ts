import type { z } from 'zod';

import type { HandledError } from '../types/error.js';
import type { ZodValidator } from '../types/zod-validator.js';
import { parseFetchJson } from './json.js';

export async function parseRequestJson<Z extends ZodValidator>(
  request: Request,
  requestSchema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  return parseFetchJson(request, requestSchema);
}
