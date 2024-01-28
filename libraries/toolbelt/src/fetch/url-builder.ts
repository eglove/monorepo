/* eslint-disable unicorn/consistent-destructuring */
import { tryCatch } from '../functional/try-catch.ts';
import { isNil } from '../is/nil.ts';
import { isObject } from '../is/object.ts';
import { isString } from '../is/string.ts';
import type { HandledError } from '../types/error.ts';

export type UrlConfig = {
  pathVariables?: Record<string, string | number>;
  searchParams?: string | Record<string, unknown>;
  urlBase?: string | URL;
};

class UrlBuilder {
  private _url: string | URL;
  private readonly searchParameters: URLSearchParams;
  private readonly pathVariables?: Record<string, string | number>;
  private readonly _config: UrlConfig | undefined;

  public constructor(urlString: string | URL, config?: UrlConfig) {
    this._url = urlString;
    this._config = config;
    this.pathVariables = config?.pathVariables;
    this.searchParameters = this.buildSearchParameters(config?.searchParams);
  }

  public get url(): HandledError<URL, Error> {
    return this.buildUrl();
  }

  public toString(): HandledError<string, Error> {
    const url = this.buildUrl();

    if (!url.isSuccess) {
      return url;
    }

    return { data: url.data.toString(), isSuccess: true };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private buildUrl(): HandledError<URL, Error> {
    let urlString = this._url.toString();

    const { pathVariables } = this;
    if (!isNil(pathVariables)) {
      for (const key in pathVariables) {
        if (Object.hasOwn(pathVariables, key)) {
          const includesColon = tryCatch(() => {
            return urlString.includes(':');
          });

          if (!includesColon.isSuccess) {
            return includesColon;
          }

          if (includesColon.data) {
            const replaced = tryCatch(() => {
              return urlString.replaceAll(
                new RegExp(':' + key, 'g'),
                String(pathVariables[key]),
              );
            });

            if (!replaced.isSuccess) {
              return replaced;
            }

            urlString = replaced.data;
          }
        }
      }
    }

    const url = tryCatch(() => {
      return new URL(urlString, this._config?.urlBase);
    });

    if (!url.isSuccess) {
      return url;
    }

    this._url = url.data;

    if (this.searchParameters.size > 0) {
      for (const [key, value] of this.searchParameters.entries()) {
        this._url.searchParams.append(key, value);
      }
    }

    return { data: this._url, isSuccess: true };
  }

  private buildSearchParameters(parameters: UrlConfig['searchParams']) {
    let searchParameters = new URLSearchParams();

    if (isString(parameters)) {
      searchParameters = new URLSearchParams(parameters);
    }

    if (isObject(parameters)) {
      for (const key in parameters) {
        if (Object.hasOwn(parameters, key)) {
          searchParameters.append(key, String(parameters[key]));
        }
      }
    }

    return searchParameters;
  }
}

export function urlBuilder(urlString: string, config?: UrlConfig): UrlBuilder {
  return new UrlBuilder(urlString, config);
}
