FROM golang:1.22-alpine

WORKDIR /app

RUN apk add --no-cache gcc musl-dev sqlite-dev
RUN go install github.com/consbio/mbtileserver@latest

EXPOSE 8080

CMD ["mbtileserver", "--dir", "/data", "--port", "8080"]