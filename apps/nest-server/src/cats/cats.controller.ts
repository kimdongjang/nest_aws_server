import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';
import { Response } from 'express';
import { Roles } from 'src/role/Roles.decorator';
import { Role } from 'src/role/role.enum';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';

@Controller('cats')
export class CatsController {
    // 컨트롤러에 Cat과 관련된 서비스를 생성자를 통해 초기화한다(의존성 주입)
    constructor(private catsService: CatsService){}
    @Post()
    @Roles(Role.Admin)
    async create(@Body() CreateCatDto: CreateCatDto){
        this.catsService.create(CreateCatDto);        
        return 'this action adds a new cat';
    }

    @Get()
    async findAll():Promise<Cat[]>{
        return this.catsService.findAll();
    }
}
