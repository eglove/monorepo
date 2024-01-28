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

    const request = testApi.request.search({
      requestInit: { body: JSON.stringify({ name: 'abc' }) },
    });

    if (request.isSuccess) {
      expect(new URL(request.data.url).host).toBe('example.com');
      expect(request.data.method).toBe('POST');
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
        todo: {
          path: 'todos/:todoId/users/:userId',
          pathVariableSchema: z.object({
            todoId: z.number(),
            userId: z.number(),
          }),
        },
      },
    });

    const todoRequest = todosApi.request.todo({
      pathVariables: {
        todoId: 1,
        userId: 3,
      },
    });

    expect(todoRequest.isSuccess).toBe(true);

    if (todoRequest.isSuccess) {
      expect(todoRequest.data.url).toBe(
        'https://jsonplaceholder.typicode.com/todos/1/users/3',
      );
    }

    globalThis.fetch = mockFetch;
    const response = await todosApi.fetch.todo({
      pathVariables: { id: 1 },
      searchParams: { hey: undefined },
    });

    if (response.isSuccess) {
      const data = await response.data?.json();
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(data).toStrictEqual(expectedResult);
    }
  });
});
