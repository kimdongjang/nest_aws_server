import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 내부에 필드 작성하는거 잊지말기
    // 문서 예시에는 안써있는데 안써주면 validate가 호출되지 않습니다.
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log("validate");
    const user = await this.authService.validateUser(email, password);

    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return true;
  }
}
