import { CacheModule, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import { async } from "rxjs";
import { RedisController } from "./redis.controller";

// export const cacheModule = CacheModule.registerAsync({
//   useFactory: async () => ({
//     store: redisStore,
//     host: "127.0.0.1",
//     port: 6379,
//     ttl: 0,
//   }),
// });

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: process.env.DOMAIN,
        port: 6379,
      }),
    }),
  ],
  controllers: [RedisController],
})
export class RedisModule {}
