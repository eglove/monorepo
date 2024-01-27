#!/bin/sh
pnpm prisma migrate deploy
exec node ./dist/server/entry.mjs
