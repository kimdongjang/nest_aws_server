import { CacheModule, Module } from "@nestjs/common";
import { AppService } from "./app.service";
import * as redisStore from "cache-manager-ioredis";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { CatModule } from "./cat/cat.module";

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
    CatModule,
  ],
  // controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
