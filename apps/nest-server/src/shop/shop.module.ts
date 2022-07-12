import { Module } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { ElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
  imports: [
    ElasticsearchModule.register({
      node: "http://localhost:9200",
    }),
  ],
  providers: [ShopService],
})
export class ShopModule {}
