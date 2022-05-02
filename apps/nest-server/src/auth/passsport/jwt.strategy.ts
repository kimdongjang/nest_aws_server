import { ConsoleLogger, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { jwtConfig } from "src/config/jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwt 추출 방법 제공(Request의 Authorization 헤더에 토큰 제공)
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 기존에 header에 token을 포함해서 request했다면, 쿠키에 포함된 token으로 확인
      jwtFromRequest: ExtractJwt.fromExtractors([
        request => {
          return request?.cookies?.Authentication.access_token;
        },
      ]),
      // false라면 jwt가 만료되었는지 확인하고, 만료되었다면 401에러 발생
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }
  async validate(payload: any) {
    return { email: payload.email, username: payload.username };
  }
}
