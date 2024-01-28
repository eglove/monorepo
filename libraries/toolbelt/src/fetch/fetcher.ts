import { openDB } from 'idb';

import { tryCatchAsync } from '../functional/try-catch.ts';
import { isBrowser } from '../is/browser.ts';
import { isNil } from '../is/nil.ts';
import type { HandledError } from '../types/error.ts';

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

    if (!database.isSuccess) {
      return database;
    }

    const expired = await this.isExpired();

    if (!expired.isSuccess) {
      return expired;
    }

    if (expired.data) {
      await cache.delete(this._request);
    }

    const cachedResponse = await cache.match(this._request);
    if (cachedResponse) {
      return { data: cachedResponse, isSuccess: true };
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + (this._cacheInterval ?? 0));

    const results = await tryCatchAsync(() => {
      return Promise.all([
        cache.add(this._request),
        database.data
          .transaction(Fetcher._DB_NAME, 'readwrite')
          .objectStore(Fetcher._DB_NAME)
          .put({ expires, key: requestKey } satisfies RequestMeta),
      ]);
    });

    if (!results.isSuccess) {
      return results;
    }

    return tryCatchAsync(() => {
      return cache.match(this._request);
    });
  }

  public getRequestKey() {
    return `${this._request.url}${this._request.headers.get('Vary') ?? ''}${
      this._request.method
    }`;
  }

  public async isExpired(): Promise<HandledError<boolean, Error>> {
    const database = await this.getRequestDatabase();

    if (!database.isSuccess) {
      return database;
    }

    const requestKey = this.getRequestKey();

    const cachedMeta = (await database.data
      .transaction(Fetcher._DB_NAME, 'readonly')
      .objectStore(Fetcher._DB_NAME)
      .get(requestKey)) as RequestMeta | undefined;

    if (cachedMeta === undefined) {
      return { data: true, isSuccess: true };
    }

    return { data: new Date() >= cachedMeta.expires, isSuccess: true };
  }

  private readonly getRequestDatabase = async () => {
    return tryCatchAsync(() => {
      return openDB<typeof Fetcher._DB_NAME>(Fetcher._DB_NAME, 1, {
        upgrade(database_) {
          const store = database_.createObjectStore(Fetcher._DB_NAME, {
            keyPath: Fetcher._DB_KEY,
          });
          store.createIndex(Fetcher._DB_KEY, Fetcher._DB_KEY);
        },
      });
    });
  };
}

export function fetcher(options: FetcherOptions) {
  return new Fetcher(options);
}
