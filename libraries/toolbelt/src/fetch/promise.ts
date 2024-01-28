import type { HandledError } from '../types/error.ts';

type Promises<T> = Record<string, Promise<T>>;

export async function promiseAllSettled<T>(
  promises: Promises<T>,
): Promise<Record<string, HandledError<T, Error>>> {
  const promiseKeys = Object.keys(promises);
  const promiseValues = Object.values(promises);

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
