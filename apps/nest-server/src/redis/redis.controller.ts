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

    await this.cacheManager.set("visitor", ++count, { ttl: 86400 });

    return count;
  }
}
