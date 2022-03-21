FROM node:lts-alpine3.10 as builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /nest-server

COPY . .
RUN npm i
RUN npx @nestjs/cli build

FROM node:lts-alpine3.10

COPY --from=builder /nest-server/dist ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/main.js"]