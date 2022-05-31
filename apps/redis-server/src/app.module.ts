import { CacheModule, Module } from "@nestjs/common";
import { AppService } from "./app.service";
import * as redisStore from "cache-manager-ioredis";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { CatModule } from "./cat/cat.module";
import { AppController } from "./app.controller";

@Module({
  /**
   * in-memory 스토리지 사용을 위한 CacheModule import
   */
  imports: [
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: "localhost",
        port: 6379,
      },
    }),
    // redis server 연결
    CacheModule.register({
      store: redisStore,
      host: "localhost",
      port: 6379,
    }),

    // redis 클러스터 사용
    // CacheModule.register({
    //   store: redisStore,
    //   clusterConfig: {
    //     nodes: [
    //       {
    //         port: 7001,
    //         host: "127.0.0.1",
    //       },
    //       {
    //         port: 7002,
    //         host: "127.0.0.1",
    //       },
    //       {
    //         port: 7003,
    //         host: "127.0.0.1",
    //       },
    //     ],
    //   },
    // }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
