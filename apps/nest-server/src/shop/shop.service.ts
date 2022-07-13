import { HttpStatus, Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { lastValueFrom } from "rxjs";
import { Shop } from "src/database/entities/Shop.entity";
import { Repository } from "typeorm";
import { SearchKeywordDto } from "./dto/searchKeywordDto";

@Injectable()
export class ShopService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>
  ) {}

  async searchShopList(dto: SearchKeywordDto) {
    // const keyword = dto.keyword;

    // if (!keyword.replace(/^\s+|\s+$/g, "")) {
    //   return {
    //     status: HttpStatus.BAD_REQUEST,
    //     data: null,
    //     error: ["keyword is empty"],
    //   };
    // }

    //https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword-sample
    const url = "https://dapi.kakao.com/v2/local/search/keyword.json";
    const config = {
      params: {
        y: dto.lat,
        x: dto.lng,
        radius: dto.radius,
        query: dto.keyword,
      },
      headers: {
        Authorization: "KakaoAK " + process.env.KAKAOMAP_APIKEY,
      },
    };
    const { data } = await axios.get(url, config);
    console.log(data);
    this.insertShop(data);

    return data;
  }

  insertShop(dataList) {
    const shopList = dataList.documents;
    shopList.map(data => {
      const shop = new Shop();
      shop.id = data.id;
      shop.addressName = data.address_name;
      shop.categoryGroupCode = data.category_group_code;
      shop.categoryGroupName = data.category_group_name;
      shop.categoryName = data.category_name;
      shop.callNumber = data.phone;
      shop.name = data.place_name;
      shop.homepageLink = data.place_url;
      shop.loadAddressName = data.road_address_name;
      shop.lat = data.y;
      shop.lng = data.x;
      shop.updateAt = new Date(Date.now());

      this.shopRepository.upsert(shop, ["id"]);
    });
  }
}
