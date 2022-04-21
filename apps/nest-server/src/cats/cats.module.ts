import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    providers:[CatsService],
    controllers: [CatsController],
    exports:[CatsService]
})
export class CatsModule {}
