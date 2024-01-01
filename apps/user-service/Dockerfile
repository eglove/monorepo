FROM node:20-alpine

WORKDIR /app
LABEL org.opencontainers.image.source https://github.com/eglove/monorepo

# We're using .dockerignore for copying
COPY . .

RUN npm install -g pnpm
RUN pnpm install

RUN pnpm build

EXPOSE 3000

CMD ["node", "server/entry.express"]
