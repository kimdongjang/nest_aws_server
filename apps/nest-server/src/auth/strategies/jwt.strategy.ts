import { ConsoleLogger, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    super({
      // jwt 추출 방법 제공(Request의 Authorization 헤더에 토큰 제공)
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 기존에 header에 token을 포함해서 request했다면, 쿠키에 포함된 token으로 확인
      jwtFromRequest: ExtractJwt.fromExtractors([
        request => {
          try {
            console.log("JwtStrategy : " + request?.cookies?.Authentication);
            return request?.cookies?.Authentication;
          } catch (error) {
            throw new HttpException("Not Found your email", HttpStatus.NOT_FOUND);
          }
        },
      ]),
      // ignoreExpiration: false라면 jwt가 만료되었는지 확인하고, 만료되었다면 401에러 발생
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
    });
  }
  /**
   * 로그인 서비스를 이용할때 유효한 사용자의 접근인지 확인
   * @param payload
   * @returns
   */
  async validate(payload): Promise<any | never> {
    console.log("3. validate 호출 ");
    try {
      return this.usersService.findByEmail(payload.user.email);
    } catch (error) {
      throw new HttpException("Not Found your email", HttpStatus.NOT_FOUND);
    }
    // return this.jwtService.verify(token, this.configService.get("JWT_ACCESS_TOKEN_SECRET"));
  }
}
