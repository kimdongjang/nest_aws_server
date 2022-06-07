import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/database/entities/Board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
    imports: [TypeOrmModule.forFeature([Board])],
    controllers: [BoardsController],
    providers: [BoardsService],
    exports: [BoardsService]
})
export class BoardsModule { }
