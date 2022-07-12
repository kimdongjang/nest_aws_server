import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { Board } from "src/database/entities/Board.entity";
import { UsersService } from "src/users/users.service";
import { BoardsService as BoardService } from "./boards.service";
import { BoardWriteDto } from "./dto/board-write.dto";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardService: BoardService, private readonly userSerivce: UsersService) {}

  @Get()
  async getAllBoard() {
    return await this.boardService.getAllBoard();
  }

  @Post("/write")
  async writeBoard(
    @Body() body: BoardWriteDto,
    //@Token() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    // body에서 access토큰을 조회해서 사용자 정보 가져와야 함
    // https://velog.io/@yiyb0603/Nest.js%EC%97%90%EC%84%9C-jwt-%ED%86%A0%ED%81%B0-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0
    console.log(res);
    // this.userSerivce.findByEmail();

    const payload = await this.boardService.createBoard(body);

    return payload;
  }

  @Get("/:id")
  async getBoard(@Param("id") id: string) {
    return await this.boardService.getBoard(id);
  }
}
