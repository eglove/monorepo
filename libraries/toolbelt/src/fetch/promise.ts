import { keys, values } from 'lodash';

import type { HandledError } from '../types/error.js';

type Promises<T> = Record<string, Promise<T>>;

export async function promiseAll<T>(
  promises: Promises<T>,
): Promise<Record<string, HandledError<T, Error>>> {
  const promiseKeys = keys(promises);
  const promiseValues = values(promises);

  const results = await Promise.allSettled(promiseValues);
  const settledPromises: Record<string, HandledError<T, Error>> = {};

  for (const [index, key] of promiseKeys.entries()) {
    const result = results[index];

    if (result.status === 'fulfilled') {
      settledPromises[key] = { data: result.value, isSuccess: true };
    }

    if (result.status === 'rejected') {
      settledPromises[key] = {
        error: result.reason as Error,
        isSuccess: false,
      };
    }
  }

  return settledPromises;
}
