FROM node:lts-alpine3.10 as builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /react-client
COPY . .
RUN npm i
RUN npm run-script build


FROM node:lts-alpine3.10
WORKDIR /react-client
COPY --from=builder /react-client/build /usr/share/nginx/html
