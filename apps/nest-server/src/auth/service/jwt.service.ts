import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { JwtService as Jwt, JwtVerifyOptions } from "@nestjs/jwt";
import { User } from "src/database/entities/User.entity";
import * as bcrypt from "bcryptjs";
import { hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtService {
  private readonly jwt: Jwt;
  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(jwt: Jwt) {
    this.jwt = jwt;
  }
}
