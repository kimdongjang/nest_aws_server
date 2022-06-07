import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { Board } from "src/database/entities/Board.entity";
import { BoardsService as BoardService } from "./boards.service";
import { BoardWriteDto } from "./dto/board-write.dto";

@Controller("boards")
export class BoardsController {
  constructor(private boardService: BoardService) {}

  @Post("/write")
  async writeBoard(@Body() body: BoardWriteDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.boardService.createBoard(body);

    // 쿠키에 jwt토큰과 refresh 토큰을 저장
    // res.cookie("Authentication", payload.accessToken);
    // res.cookie("Refresh", payload.refreshToken);

    return payload;
  }

  @Get("/:id")
  async getBoard(@Param("id") id: string) {
    return await this.boardService.getBoard(id);
  }
}
