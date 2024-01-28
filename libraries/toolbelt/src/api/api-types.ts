import type { z } from 'zod';

import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export type RequestConfig = {
  bodySchema?: ZodValidator;
  defaultRequestInit?: RequestInit;
  path: string;
  pathVariableSchema?: ZodValidator;
  responseSchema?: ZodValidator;
  searchParamSchema?: ZodValidator;
};

export type ApiConfig<T extends Record<string, Readonly<RequestConfig>>> = {
  baseUrl: string;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  requests: T;
};

export type RequestOptions = {
  pathVariables?: Record<string, string | number>;
  requestInit?: RequestInit;
  searchParams?: Record<string, string | number | undefined>;
};

export type RequestFunction = (
  options?: RequestOptions,
) => HandledError<Request, z.ZodError | Error>;

export type FetchOptions = RequestOptions & { cacheInterval?: number };

export type FetchFunction = (
  options?: FetchOptions,
) =>
  | Promise<HandledError<Response | undefined, Error>>
  | HandledError<Response | undefined, Error | z.ZodError>;
