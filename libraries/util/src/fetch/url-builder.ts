import { forEach, isEmpty, isNil, isObject, isString } from 'lodash';

export type UrlConfig = {
  pathVariables?: Array<string | number>;
  searchParams?: string | Record<string, unknown>;
  urlBase?: string | URL;
};

class UrlBuilder {
  private _url: URL;
  private readonly searchParameters: URLSearchParams;
  private readonly pathVariables: Array<string | number | undefined>;

  public constructor(urlString: string, config?: UrlConfig) {
    this._url = new URL(urlString, config?.urlBase);
    this.pathVariables = config?.pathVariables ?? [];
    this.searchParameters = this.buildSearchParameters(config?.searchParams);
  }

  public get url(): URL {
    return this.buildUrl();
  }

  public toString(): string {
    return this.buildUrl().toString();
  }

  private buildUrl(): URL {
    if (!isEmpty(this.pathVariables)) {
      let urlString = this._url.toString();

      for (const pathVariable of this.pathVariables) {
        if (pathVariable !== undefined) {
          urlString += `${pathVariable}/`;
        }
      }

      this._url = new URL(urlString);
    }

    if (this.searchParameters.size > 0) {
      for (const [key, value] of this.searchParameters.entries()) {
        this._url.searchParams.append(key, value);
      }
    }

    return this._url;
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
