import { config } from 'dotenv';
import { z } from 'zod';

export function getEnvironment() {
  config();
  return z
    .object({
      MINIO_ROOT_PASSWORD: z.string(),
      MINIO_ROOT_USER: z.string(),
    })
    .parse(process.env);
}
