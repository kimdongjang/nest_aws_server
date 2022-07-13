import { Module } from "@nestjs/common";
import { ShopService } from "./shop.service";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ShopController } from "./shop.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Shop } from "src/database/entities/Shop.entity";

@Module({
  imports: [
    ElasticsearchModule.register({
      node: "http://localhost:9200",
    }),
    TypeOrmModule.forFeature([Shop]),
  ],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
