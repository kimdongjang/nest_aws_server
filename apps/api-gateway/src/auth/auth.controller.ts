import { Body, Controller, Inject, OnModuleInit, Post, Request, UseGuards } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthServiceClient, AUTH_SERVICE_NAME, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./auth.pb";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("Register")
  private async register(@Body() body) {
    return this.authService.register(body);
  }
  @Post("login")
  private async login(@Body() body) {
    return this.authService.login(body);
  }
  @Post("logout")
  private async logout() {
    return this.authService.logout();
  }
}
