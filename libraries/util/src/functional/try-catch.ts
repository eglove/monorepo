import type { HandledError } from '../types/error.js';

export function tryCatch<T extends () => ReturnType<T>, E extends Error>(
  function_: T,
): HandledError<ReturnType<T>, E> {
  try {
    return { data: function_(), isSuccess: true };
  } catch (error: unknown) {
    return { error: error as E, isSuccess: false };
  }
}

export async function tryCatchAsync<
  T extends () => Promise<Awaited<ReturnType<T>>>,
  E extends Error,
>(function_: T): Promise<HandledError<Awaited<ReturnType<T>>, E>> {
  try {
    const data = await function_();
    return { data, isSuccess: true };
  } catch (error) {
    return { error: error as E, isSuccess: false };
  }
}
