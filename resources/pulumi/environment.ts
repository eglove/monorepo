import { config } from 'dotenv';
import { z } from 'zod';

export function getEnvironment() {
  config();
  return z.object({}).parse(process.env);
}
