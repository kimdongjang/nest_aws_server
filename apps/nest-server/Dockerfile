FROM node:lts-alpine as builder
RUN apk --no-cache add --virtual builds-deps build-base

WORKDIR /usr/src/app
COPY package* ./

# install dependencies
RUN npm install --silent
COPY . .


# build application
RUN npm run build

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 4949

CMD [ "node", "./dist/main" ]