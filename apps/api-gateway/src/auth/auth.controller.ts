import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  @Post("/login") // 1번
  async login(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
