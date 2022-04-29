import {
  Inject,
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as jwt from "jsonwebtoken";
import { ConfigType } from "@nestjs/config";
import { UserEntity } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { LocalAuthGuard } from "./passsport/local-auth.guard";
import { jwtConfig } from "../config/jwt.config";
import { VerifyEmailDto } from "src/email/dto/verify-email.dto";

// username과 password를 통해 인증을 진행
// 한번 인증되었다면 서버는 특정 request에서 인증 상태를 확인하기 위해 jwt를 발급
// 유효한 jwt를 가지고 있는 request만 접근할 수 있는 protected routes를 생성
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // local.stragtegy에서 정의한 email과 password로 validate를 검사하는 과정을 진행함
  async login(email: string, password: string) {
    // const payload = {username: user.username, sub:user.userid};
    // return {user, access_token: this.jwtService.sign(payload)};
    const payload = await this.validateUser(email, password);
    console.log(payload)

    // access_token: this.jwtService.sign({ payload, jwtConfig.secret),

    return jwt.sign(payload, jwtConfig.secret);
  }

  // user를 검색하고 패스워드가 맞는지 확인해서 반환함
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      // result는 password 를 제외한 user의 모든 정보를 포함한다.
      return result;
    }
    return null;
  }

  /**
   * 토큰으로 이메일 검사
   * @param signupVerifyToken
   * @returns
   */
  async verifyEmail(signupVerifyToken: string) {
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    const user = await this.usersService.findByToken(signupVerifyToken);
    console.log(user);

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    return this.login(user.email, user.password);
  }

  /**
   * jwt 토큰으로 검사
   * @param jwtString
   * @returns
   */
  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, jwtConfig.secret) as (
        | jwt.JwtPayload
        | string
      ) &
        UserEntity;
        console.log(payload)

      return payload;

    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  googleLogin(req) {
    if (!req.user) {
      return "No user from google";
    }
    return {
      message: "User information from google",
      user: req.user,
    };
  }
}
