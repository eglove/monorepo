FROM rust:1.75.0-alpine

LABEL org.opencontainers.image.source https://github.com/eglove/monorepo

WORKDIR /app

RUN apk add --no-cache musl-dev gcc

COPY . .

RUN cargo build --release

EXPOSE 8080

CMD ["./target/release/image-optimization"]
