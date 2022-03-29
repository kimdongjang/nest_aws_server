import {Module} from '@nestjs/common';
import {EmailModule} from 'src/email/email.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [EmailModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
