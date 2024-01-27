FROM golang:latest

WORKDIR /app

ENV MONGODB_URI=mongodb://localhost:27017

COPY . .

RUN go mod tidy

RUN go build -o /dist

EXPOSE 8080

CMD [ "/dist" ]
