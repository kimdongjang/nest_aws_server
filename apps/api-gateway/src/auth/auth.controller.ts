import { Body, Controller, Inject, OnModuleInit, Post, Request, UseGuards } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthServiceClient, AUTH_SERVICE_NAME, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./auth.pb";

@Controller("auth")
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;
  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('Register')
  private async register(
    @Body() body: RegisterRequest,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body);
  }
  @Post('login')
  private async login(
    @Body() body: LoginRequest,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(body);
  }
  @Post('logout')
  private async logout(): Promise<Observable<LoginResponse>> {
    return this.svc.logout();
  }
}
