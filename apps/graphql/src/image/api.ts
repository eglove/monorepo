import { Api } from '@ethang/toolbelt/api/api';
import { z } from 'zod';

const BASE_URL = 'http://localhost:80';

export const imageApi = new Api({
  baseUrl: `${BASE_URL}/image`,
  requests: {
    imageCreate: {
      defaultRequestInit: {
        method: 'POST',
      },
      path: '',
    },
    imageDetailsGet: {
      path: ':filename/info',
      pathVariableSchema: z.object({ filename: z.string() }),
    },
    imageGet: {
      path: ':filename',
      pathVariableSchema: z.object({ filename: z.string() }),
      searchParamSchema: z.object({
        h: z.string().optional(),
        w: z.string().optional(),
      }),
    },
  },
});
