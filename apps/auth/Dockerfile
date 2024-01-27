FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g npm pnpm && pnpm i

COPY . .
COPY .env.dockerdev .env

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

RUN pnpm prisma generate
RUN pnpm build

RUN chmod +x ./app-start.sh
CMD ["/app/app-start.sh"]
