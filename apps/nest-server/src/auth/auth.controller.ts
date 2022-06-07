import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VerifyEmailDto } from "src/email/dto/verify-email.dto";
// import { Public } from "src/skip-auth.decorator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { CustomGuard } from "./guards/custom.guard";
import { User } from "src/database/entities/User.entity";
import { UserLoginDto } from "src/users/dto/login-user.dto";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "src/skip-auth.decorator";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@ApiTags("AuthApi")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  /**
   * 회원 가입
   * @param createUserDto email, username, password
   * @returns
   */
  @Public()
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  /**
   * 이메일과 패스워드 받아서 로그인
   * 해당 유저에 해당되는 아이디 값을 통해 AccessToken과 RefreshToken을 발급, cookie에 저장하여 리턴
   *
   * @param body
   * @param res
   * @returns
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() body: UserLoginDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(body);

    // 쿠키에 jwt토큰과 refresh 토큰을 저장
    res.cookie("Authentication", payload.accessToken);
    res.cookie("Refresh", payload.refreshToken);

    return payload;
  }

  /**
   * public 데코레이터의 의하여 Access Token 검증을 스킵,
   * JwtRefreshGuard 에 의해 현재 쿠키에 있는 Refresh Token이 유효한지 확인 한 후, 유효 하다면 User 정보를 가져옵니다.
   * @param req
   * @param res
   * @returns
   */
  // @Public()
  // @UseGuards(JwtRefreshGuard)
  @Get("logout")
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    // 초기화된 쿠키의 옵션을 가져와서 cookie에 담아서 초기화
    const { accessOption, refreshOption } = await this.authService.getCookiesForLogOut(req.body.email);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);

    return HttpStatus.OK;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.body;
    console.log(user);
    const { accessToken: access_token, ...accessOption } = await this.authService.login(user.email);
    res.cookie("Authentication", access_token);

    return user;
  }

  // @UseGuards(JwtStrategy)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {
    return;
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    // console.log(req);
    const payload = await this.authService.googleLogin(req); // 만약 회원 정보가 없다면 회원가입으로 이동시키던지 어쩌구...

    // 쿠키에 jwt토큰과 refresh 토큰을 저장
    res.cookie("Authentication", payload.accessToken);
    res.cookie("Refresh", payload.refreshToken);

    return payload;
  }

  @UseGuards(CustomGuard)
  @Get("/custom/login")
  getHello(): string {
    return "hi";
  }

  // 가입 확인 인증 진행
  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<any> {
    const { signupVerifyToken } = dto;
    console.log(signupVerifyToken);

    // jwt토큰을 리턴합니다. 클라이언트는 jwt를 저장한 후 리소스를 요청할때 함께 전달합니다.
    return await this.authService.verifyEmail(signupVerifyToken);
  }

  // Bearer Token에 발급받은 JWT Token으로 해당 토큰을 통해 유저의 정보를 확인하고
  // 유저의 정보를 반환한다.
  // 이 과정을 Guard를 사용해 JWT Token 인증과정이 여러 엔드포인트에서도 사용될 수 있도록 처리한다.
  @UseGuards(CustomGuard)
  @Get("/email")
  async getUserInfo(@Param("email") email: string): Promise<User> {
    // const jwtString = headers.authorization.split("Bearer ")[1];

    // this.authService.verify(jwtString);

    return this.usersService.findByEmail(email);
  }
}
