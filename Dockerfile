FROM golang:1.12-alpine AS builder

WORKDIR /go/src/github.com/edgexfoundry/edgex-ui-go-custom

RUN apk update && apk add git make

COPY . .

RUN make prepare
RUN make cmd/edgex-ui-server/edgex-ui-server

FROM alpine:3.6

EXPOSE 4500

COPY --from=builder /go/src/github.com/edgexfoundry/edgex-ui-go-custom/cmd/edgex-ui-server /go/src/github.com/edgexfoundry/edgex-ui-go-custom/cmd/edgex-ui-server

WORKDIR /go/src/github.com/edgexfoundry/edgex-ui-go-custom/cmd/edgex-ui-server

ENTRYPOINT ["./edgex-ui-server"]
