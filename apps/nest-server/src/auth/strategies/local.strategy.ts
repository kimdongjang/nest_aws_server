import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

/**
 * 입력한 이메일과 패스워드가 유효한지 확인하는 local 전략
 * module에서 import: passportModule, providers: localstrategy 등록
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 내부에 필드 작성하는거 잊지말기
    // 문서 예시에는 안써있는데 안써주면 validate가 호출되지 않습니다..
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log("local stretagey ");
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
