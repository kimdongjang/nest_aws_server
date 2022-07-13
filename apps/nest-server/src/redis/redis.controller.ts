import { CACHE_MANAGER, Controller, Inject, Post } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Public } from "src/skip-auth.decorator";

@Controller("redis")
export class RedisController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Public()
  @Post("/visit")
  async visit(): Promise<number> {
    let count: number = await this.cacheManager.get("visitor");
    console.log("레디스 호출");

    await this.cacheManager.set("visitor", ++count, { ttl: 1000 });

    return count;
  }

  @Public()
  @Post("/shop/insert")
  async search(): Promise<number> {
    let count: number = await this.cacheManager.get("visitor");
    console.log("레디스 호출");

    await this.cacheManager.set("visitor", ++count, { ttl: 1000 });

    return count;
  }
}
