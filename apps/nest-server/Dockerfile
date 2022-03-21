FROM node:lts-alpine3.10 as builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /nest-server/builder

COPY . .
RUN npm i
RUN npx @nestjs/cli build



FROM node:lts-alpine3.10

WORKDIR /nest-server
COPY --from=builder /nest-server/builder ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/main.js"]