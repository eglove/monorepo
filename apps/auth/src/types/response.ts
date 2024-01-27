export type StandardResponse<T, E extends Record<string, string>> = {
  data: T;
  errors: Array<E> | null;
};

export function standardResponse<T, E extends Record<string, string>>(
  data: T,
  errors: Array<E> | null,
  responseInit: ResponseInit,
) {
  const responseData = { data, errors } satisfies StandardResponse<T, E>;

  return new Response(JSON.stringify(responseData), responseInit);
}
