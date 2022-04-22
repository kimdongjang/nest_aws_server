import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {EmailModule} from 'src/email/email.module';
import { UserEntity } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';


// TypeOrmModule.forFeature()로 해당 엔티티를 해당 모듈에서 사용하겠다고 등록
@Module({
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
