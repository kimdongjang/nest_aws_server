import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchKeywordDto } from "./dto/searchKeywordDto";
import { ShopService } from "./shop.service";

@ApiTags("ShopApi")
@Controller("shop")
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get("search/list")
  async searchShopList(@Query() dto: SearchKeywordDto) {
    return await this.shopService.searchShopList(dto);
  }
}
