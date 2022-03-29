import { Controller, Get } from "@nestjs/common";


@Controller("user")
export class UserController{
    @Get('/signin')
    async signin(){
        return 'signin';
    }
}