import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "src/database/entities/Board.entity";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";

@Module({
  imports: [TypeOrmModule.forFeature([Board]), UsersModule],
  controllers: [BoardsController],
  providers: [BoardsService, UsersService],
  exports: [BoardsService],
})
export class BoardsModule {}
