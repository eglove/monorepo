FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g npm pnpm && pnpm i

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
