import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Board } from "../database/entities/Board.entity";
import { BoardWriteDto } from "./dto/board-write.dto";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ) {}

  getAllBoard() {
    return this.boardRepository.find();
  }

  createBoard(request: BoardWriteDto) {
    return;
  }

  getBoard(id: number) {
    return this.boardRepository.find({ where: { id: id } });
  }
}
