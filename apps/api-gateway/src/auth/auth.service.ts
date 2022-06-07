import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/User.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  async validateUser(email: string, pass: string): Promise<any> {
    // const user = await this.usersRepository.findOne({
    //   where: { email },
    // });

    // const password = await bcrypt.compare(pass, user.password);
    // if (password) {
    //   const { password, ...userWithoutPassword } = user;
    //   return userWithoutPassword;
    // }
    return null;
  }
}
