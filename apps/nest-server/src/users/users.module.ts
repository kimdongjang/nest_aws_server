import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { EmailModule } from "src/email/email.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/database/entities/User.entity";
import { LocalAuthenticaion } from "src/database/entities/LocalAuthenticaion.entity";
import { SocialAuthentication } from "src/database/entities/SocialAuthentication.entity";

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([User, LocalAuthenticaion, SocialAuthentication])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
