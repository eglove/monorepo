import { openDB } from 'idb';
import { isNil } from 'lodash';

import { tryCatchAsync } from '../functional/try-catch.ts';
import { isBrowser } from '../is/browser.ts';
import type { HandledError } from '../types/error.js';

type FetcherOptions = {
  cacheInterval?: number;
  cacheKey?: string;
  request: Request;
};

type RequestMeta = {
  expires: Date;
  key: string;
};

class Fetcher {
  private _cacheInterval?: number;
  private readonly _cacheKey: string;
  private readonly _request: Request;

  private static readonly _DB_NAME = 'requests';
  private static readonly _DB_KEY = 'key';

  public constructor({ cacheKey, cacheInterval, request }: FetcherOptions) {
    this._cacheKey = cacheKey ?? 'cache';
    this._cacheInterval = cacheInterval;
    this._request = request;
  }

  public get request() {
    return this._request;
  }

  public get cacheKey() {
    return this._cacheKey;
  }

  public get cacheInterval() {
    return this._cacheInterval;
  }

  public set cacheInterval(interval: number | undefined) {
    this._cacheInterval = interval;
  }

  public async fetch(): Promise<HandledError<Response | undefined, Error>> {
    if (!isBrowser || isNil(this._cacheInterval) || this._cacheInterval <= 0) {
      return tryCatchAsync(() => {
        return fetch(this._request);
      });
    }

    const cache = await caches.open(this._cacheKey);
    const requestKey = this.getRequestKey();
    const database = await this.getRequestDatabase();

    if (await this.isExpired()) {
      await cache.delete(this._request);
    }

    const cachedResponse = await cache.match(this._request);
    if (cachedResponse) {
      return { data: cachedResponse, isSuccess: true };
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (this._cacheInterval ?? 0));

    await Promise.all([
      cache.add(this._request),
      database
        .transaction(Fetcher._DB_NAME, 'readwrite')
        .objectStore(Fetcher._DB_NAME)
        .put({ expires, key: requestKey } satisfies RequestMeta),
    ]);

    return { data: await cache.match(this._request), isSuccess: true };
  }

  public getRequestKey() {
    return `${this._request.url}${this._request.headers.get('Vary') ?? ''}${
      this._request.method
    }`;
  }

  public async isExpired() {
    const database = await this.getRequestDatabase();
    const requestKey = this.getRequestKey();

    const cachedMeta = (await database
      .transaction(Fetcher._DB_NAME, 'readonly')
      .objectStore(Fetcher._DB_NAME)
      .get(requestKey)) as RequestMeta | undefined;

    if (cachedMeta === undefined) {
      return true;
    }

    return new Date() >= cachedMeta.expires;
  }

  private readonly getRequestDatabase = async () => {
    return openDB<typeof Fetcher._DB_NAME>(Fetcher._DB_NAME, 1, {
      upgrade(database_) {
        const store = database_.createObjectStore(Fetcher._DB_NAME, {
          keyPath: Fetcher._DB_KEY,
        });
        store.createIndex(Fetcher._DB_KEY, Fetcher._DB_KEY);
      },
    });
  };
}

export function fetcher(options: FetcherOptions) {
  return new Fetcher(options);
}
