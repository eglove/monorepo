import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from 'prisma/prisma-client';

const libsql = createClient({
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
  url: `${process.env.TURSO_DATABASE_URL}`,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
