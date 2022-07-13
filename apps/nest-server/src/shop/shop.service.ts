import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import axios from "axios";
import { lastValueFrom } from "rxjs";
import { SearchKeywordDto } from "./dto/searchKeywordDto";

@Injectable()
export class ShopService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchShopList(dto: SearchKeywordDto) {
    const keyword = dto.keyword;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }
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
    return data;
  }
}
