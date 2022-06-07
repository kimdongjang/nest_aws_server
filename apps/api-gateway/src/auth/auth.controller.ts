import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("auth")
export class AuthController {
  @UseGuards(LocalAuthGuard) // 2번
  @Post("/login") // 1번
  async login(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
