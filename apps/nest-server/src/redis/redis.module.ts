import { CacheModule, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import { async } from "rxjs";
import { RedisController } from "./redis.controller";

const cacheModule = CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: process.env.DOMAIN,
    port: 6379,
    ttl: 0, // ttl : 0 캐시 만료 비활성화
  }),
});

@Module({
  imports: [cacheModule],
  controllers: [RedisController],
  exports: [cacheModule],
})
export class RedisModule {}
