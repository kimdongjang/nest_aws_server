import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { Board } from "src/database/entities/Board.entity";
import { BoardsService as BoardService } from "./boards.service";
import { BoardWriteDto } from "./dto/board-write.dto";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardService: BoardService) { }

  @Post("/write")
  async writeBoard(@Body() body: BoardWriteDto) {
    const payload = await this.boardService.createBoard(body);

    return payload;
  }

  @Get("/:id")
  async getBoard(@Param("id") id: string) {
    return await this.boardService.getBoard(id);
  }
}
