import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/User.entity";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../types/jwtPayload.type";
import { JwtPayloadWithRt } from "../types/jwtPayloadWithRt.type";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            return request?.cookies?.Refresh;
          } catch (error) {
            throw new HttpException("Not Found your email", HttpStatus.NOT_FOUND);
          }
        },
      ]),
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    console.log("validate");
    console.log(payload);
    const refreshToken = request.cookies?.Refresh;
    return await this.usersService.getUserIfRefreshTokenMatches(refreshToken, payload.user.email);
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
