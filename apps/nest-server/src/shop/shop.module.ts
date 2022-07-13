import { Module } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ShopController } from "./shop.controller";

@Module({
  imports: [
    ElasticsearchModule.register({
      node: "http://localhost:9200",
    }),
  ],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
