import { forEach, isNil, isObject, isString } from 'lodash';

import { tryCatch } from '../functional/try-catch.ts';
import type { HandledError } from '../types/error.js';

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

  private buildUrl(): HandledError<URL, Error> {
    let urlString = this._url.toString();

    forEach(this.pathVariables, (variable, key) => {
      if (urlString.includes(':')) {
        urlString = urlString.replaceAll(
          new RegExp(':' + key, 'g'),
          String(variable),
        );
      }
    });

    const url = tryCatch(() => {
      return new URL(urlString, this._config?.urlBase);
    });

    if (!url.isSuccess) {
      return { error: url.error, isSuccess: false };
    }

    this._url = url.data;

    if (this.searchParameters.size > 0) {
      for (const [key, value] of this.searchParameters.entries()) {
        this._url.searchParams.append(key, value);
      }
    }

    return { data: this._url, isSuccess: true };
  }

  private buildSearchParameters(
    parameters: UrlConfig['searchParams'],
  ): URLSearchParams {
    let searchParameters = new URLSearchParams();

    if (isString(parameters)) {
      searchParameters = new URLSearchParams(parameters);
    }

    if (isObject(parameters)) {
      forEach(parameters, (parameter, key) => {
        if (!isNil(parameter)) {
          searchParameters.append(key, String(parameter));
        }
      });
    }

    return searchParameters;
  }
}

export function urlBuilder(urlString: string, config?: UrlConfig): UrlBuilder {
  return new UrlBuilder(urlString, config);
}
