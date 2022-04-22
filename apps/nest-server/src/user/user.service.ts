import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class UserService {
    constructor(
        // repository 사용을 위해 Service와 User와 의존관계를 주입한다.
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ){}

    findAll(): Promise<UserEntity[]> {
        console.log(this.usersRepository)
        return this.usersRepository.find();
    }

    async findByName(username: string): Promise<UserEntity | undefined> {
        return this.usersRepository.findOne({where : {username}});        
    }

    async remove(id: string): Promise<void>{
        await this.usersRepository.delete(id);
    }

    async create(userData:CreateUserDto):Promise<UserEntity>{
        const {email, username, password} = userData;
        const user = new UserEntity();
        user.email = email;
        user.password = password;
        user.username = username;

        await this.usersRepository.save(user);    


        return user;        
    }
}
