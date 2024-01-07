FROM rust:1.75.0-buster

LABEL org.opencontainers.image.source https://github.com/eglove/monorepo

WORKDIR /app

RUN apt-get update \
    && apt-get install -y build-essential pkg-config libssl-dev

COPY . .

RUN cargo build --release

EXPOSE 8080

CMD ["./target/release/image-optimization"]
