import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      // jwt 추출 방법 제공(Request의 Authorization 헤더에 토큰 제공)
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 기존에 header에 token을 포함해서 request했다면, 쿠키에 포함된 token으로 확인
      jwtFromRequest: ExtractJwt.fromExtractors([
        request => {
          try {
            return request?.cookies?.Authentication.access_token;
          } catch (error) {
            throw new HttpException(
              "Not Found your email",
              HttpStatus.NOT_FOUND
            );
          }
        },
      ]),
      // false라면 jwt가 만료되었는지 확인하고, 만료되었다면 401에러 발생
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
    });
  }
  async validate(payload: any) {
    return this.usersService.findByEmail(payload.email);
  }
}
