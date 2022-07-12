import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/User.entity";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../types/jwtPayload.type";
import { JwtPayloadWithRt } from "../types/jwtPayloadWithRt.type";

/**
 * 리프레시 토큰을 이용해 액세스 토큰을 재발급
 * 만약, 리프레시 토큰도 유효기간이 지났을 경우, 로그인 페이지로 이동시키게끔 처리
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            return request?.cookies?.Refresh;
          } catch (error) {
            throw new HttpException("refresh token error", HttpStatus.GATEWAY_TIMEOUT);
          }
        },
      ]),
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies?.Refresh;
    console.log("JwtRefreshStrategy validate " + refreshToken);
    const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, payload.email);
    return user;
  }
}

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
//   constructor(configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
//       passReqToCallback: true,
//     });
//   }

//   validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
//     console.log("validate");
//     const refreshToken = req?.get("authorization")?.replace("Bearer", "").trim();

//     if (!refreshToken) throw new ForbiddenException("Refresh token malformed");

//     return {
//       ...payload,
//       refreshToken,
//     };
//   }
// }
