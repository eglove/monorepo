import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Api } from '../../src/api/api.ts';

describe('api setup', () => {
  test('initializes api correctly', () => {
    const testApi = new Api({
      baseUrl: 'http://example.com',
      cacheInterval: 100,
      defaultRequestInit: {
        method: 'GET',
      },
      requests: {
        search: {
          bodySchema: z.object({ name: z.string() }),
          defaultRequestInit: {
            method: 'POST',
          },
          path: 'search',
        },
      },
    });

    // @ts-expect-error allow private read
    expect(testApi.config.baseUrl).toBe('http://example.com');
    // @ts-expect-error allow private read
    expect(testApi.config.cacheInterval).toBe(100);
    // @ts-expect-error allow private read
    expect(testApi.config.defaultRequestInit).toStrictEqual({
      method: 'GET',
    });

    const request = testApi.request.search({
      requestInit: { body: { name: 'abc' } },
    });

    if (request.isSuccess) {
      expect(request.isSuccess).toBe(true);
      expect(request.data.url).toBe('http://example.com/search');
    }
  });

  test('calls fetch', async () => {
    const expectedResult = {
      completed: false,
      id: 1,
      title: 'delectus aut autem',
      userId: 1,
    };
    const mockFetch = vi.fn().mockResolvedValue({
      json() {
        return expectedResult;
      },
    });

    const todosApi = new Api({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      requests: {
        todos: {
          path: 'todos',
        },
      },
    });

    // eslint-disable-next-line functional/immutable-data
    globalThis.fetch = mockFetch;
    const response = await todosApi.fetch.todos({
      pathVariables: ['1'],
      searchParams: { hey: undefined },
    });

    if (response.isSuccess) {
      const data = await response.data?.json();
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(data).toStrictEqual(expectedResult);
    }
  });
});
