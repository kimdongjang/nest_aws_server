import { Body, Controller, Get, Post } from "@nestjs/common";
import { Cat } from "./cat";
import { CatService } from "./cat.service";
import { CreateCatDto } from "./create-cat.dto";

@Controller("cat")
export class CatController {
  constructor(private readonly catsService: CatService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  @Post("/create")
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return await this.catsService.create(createCatDto);
  }
}
