import { Api } from '@ethang/toolbelt/api/api';
import { z } from 'zod';

const BASE_URL = 'http://localhost:80';

const imageApi = new Api({
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
      pathVariableLength: 1,
    },
    imageGet: {
      path: ':filename',
      pathVariableLength: 1,
      searchParamSchema: z.object({
        h: z.string().optional(),
        w: z.string().optional(),
      }),
    },
  },
});
