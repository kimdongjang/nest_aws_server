FROM node:lts-alpine3.10 as builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /react-client
COPY . .
RUN npm i
RUN npm run-script build


FROM nginx:1.19.2

WORKDIR /usr/share/nginx/html
COPY --from=builder /react-client/build /usr/share/nginx/html
COPY --from=builder /react-client/nginx.conf /etc/nginx/nginx.conf