import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/User.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
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
    console.log("refresh");
    const refreshToken = request.cookies?.Refresh;
    return this.usersService.getUserIfRefreshTokenMatches(refreshToken, payload.email);
  }
}
