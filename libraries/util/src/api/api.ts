import { isNil, merge } from 'lodash';
import type { z, ZodSchema } from 'zod';

import { fetcher } from '../fetch/fetcher.ts';
import { urlBuilder } from '../fetch/url-builder.ts';
import { parseJson } from '../json/json.ts';
import type { HandledError } from '../types/error.js';
import type { ZodValidator } from '../types/zod-validator.js';

type RequestConfig = {
  bodySchema?: ZodValidator;
  defaultRequestInit?: RequestInit;
  path: string;
  pathVariableLength?: number;
  searchParamSchema?: ZodSchema;
};

type ApiConfig<T extends Record<string, Readonly<RequestConfig>>> = {
  baseUrl: string;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  requests: T;
};

type RequestOptions = {
  pathVariables?: Array<string | number>;
  requestInit?: RequestInit | Record<string, unknown>;
  searchParams?: Record<string, string | number | undefined>;
};

type RequestFunction = (
  options?: RequestOptions,
) => HandledError<Request, z.ZodError | Error>;

type FetchOptions = RequestOptions & { cacheInterval?: number };
type FetchFunction = (
  options?: FetchOptions,
) =>
  | Promise<HandledError<Response | undefined, Error>>
  | HandledError<Response | undefined, Error | z.ZodError>;

export class Api<T extends Record<string, Readonly<RequestConfig>>> {
  private readonly config: ApiConfig<T>;
  private readonly globalCacheInterval: number;

  // @ts-expect-error generated in constructor
  public readonly request: {
    [K in keyof T]: RequestFunction;
  } = {};

  // @ts-expect-error generated in constructor
  public readonly fetch: {
    [K in keyof T]: FetchFunction;
  } = {};

  public constructor(config: ApiConfig<T>) {
    this.config = config;
    this.globalCacheInterval = config.cacheInterval ?? 0;

    for (const key of Object.keys(this.config.requests)) {
      this.request[key as keyof T] = this.generateRequestMethod(key);
      this.fetch[key as keyof T] = this.generateFetchMethod(key);
    }
  }

  private generateFetchMethod(key: string): FetchFunction {
    return (options?: FetchOptions) => {
      const request = this.request[key](options);

      if (!request.isSuccess) {
        return { error: request.error, isSuccess: false };
      }

      return fetcher({
        cacheInterval: options?.cacheInterval ?? this.globalCacheInterval,
        request: request.data,
      }).fetch();
    };
  }

  private generateRequestMethod(key: string): RequestFunction {
    const requestConfig = this.config.requests[key];

    return (options?: RequestOptions) => {
      if (!isNil(requestConfig.bodySchema)) {
        const bodyInit = options?.requestInit?.body;

        if (typeof bodyInit === 'string') {
          const parsedBodyInit = parseJson(bodyInit, requestConfig.bodySchema);

          if (!parsedBodyInit.isSuccess) {
            return parsedBodyInit;
          }
        } else {
          const parsedBodyInit = requestConfig.bodySchema.safeParse(bodyInit);

          if (!parsedBodyInit.success) {
            return { error: parsedBodyInit.error, isSuccess: false };
          }
        }
      }

      if (!isNil(requestConfig.searchParamSchema)) {
        const parsed = requestConfig.searchParamSchema.safeParse(
          options?.searchParams,
        );

        if (!parsed.success) {
          return { error: parsed.error, isSuccess: parsed.success };
        }
      }

      if (
        !isNil(requestConfig.pathVariableLength) &&
        options?.pathVariables?.length !== requestConfig.pathVariableLength
      ) {
        return {
          error: new Error(
            `invalid number of path variables. Expected: ${options?.pathVariables?.length} Received: ${requestConfig.pathVariableLength}`,
          ),
          isSuccess: false,
        };
      }

      const builder = urlBuilder(requestConfig.path, {
        pathVariables: options?.pathVariables,
        searchParams: options?.searchParams,
        urlBase: this.config.baseUrl,
      });

      if (!builder.url.isSuccess) {
        return builder.url;
      }

      const requestInit = merge(
        {},
        this.config.defaultRequestInit,
        requestConfig.defaultRequestInit,
        options?.requestInit,
      );

      return {
        data: new Request(builder.url.data, requestInit),
        isSuccess: true,
      };
    };
  }
}
