import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export class ShopService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
}
