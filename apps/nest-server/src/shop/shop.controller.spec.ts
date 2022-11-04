import { Test, TestingModule } from "@nestjs/testing";
import { SearchKeywordDto } from "./dto/searchKeywordDto";
import { ShopController } from "./shop.controller";

describe("ShopController", () => {
  let controller: ShopController;

  // 각 테스트 케이스가 실행되기 이전에 수행될 내용
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
    }).compile();

    controller = module.get<ShopController>(ShopController);
  });

  // describe('list', () => {
  //   it()
  // })
  describe("root", () => {
    it('should return "Hello World!!!"', () => {
      expect(controller.searchShopList({ keyword: "치킨", lat: 126.59, lng: 37.33, radius: 10 }));
    });
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
