import type { z } from 'zod';

import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';
import { parseFetchJson } from './json.ts';

export async function parseRequestJson<Z extends ZodValidator>(
  request: Request,
  requestSchema: Z,
): Promise<HandledError<z.output<Z>, Error | z.ZodError<Z>>> {
  return parseFetchJson(request, requestSchema);
}
