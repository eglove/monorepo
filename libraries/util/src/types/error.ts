export type HandledError<T, E> =
  | { data: T; isSuccess: true }
  | { error: E; isSuccess: false };
