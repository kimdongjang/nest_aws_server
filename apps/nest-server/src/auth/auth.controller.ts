import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Query, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VerifyEmailDto } from "src/email/dto/verify-email.dto";
import { Public } from "src/skip-auth.decorator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { CustomGuard } from "./guards/custom.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { User } from "src/database/entities/User.entity";
import { UserLoginDto } from "src/users/dto/login-user.dto";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("AuthApi")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  /**
   * 회원 가입
   * @param createUserDto email, username, password
   * @returns
   */
  // @Public()
  @Post("/register")
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  // 이메일과 패스워드 받아서 로그인. jwt토큰에 user 정보를 받아서 json으로 리턴.
  // UseGuards에서 이름을 참조해 passport-local패키지에서 제공하는 코드와 연결
  // @Public()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  // async login(@Request() req, @Res({ passthrough: true }) res: Response) {
  async login(@Body() body: UserLoginDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(body);

    // 쿠키에 jwt토큰과 refresh 토큰을 저장
    res.cookie("Authentication", payload.accessToken);
    res.cookie("Refresh", payload.refreshToken);

    return payload;
  }

  @UseGuards(JwtStrategy)
  @Get("/logout")
  async logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    // const { access_token, ...option } = await this.authService.logOut();
    // res.cookie("Authentication", access_token, option);
    console.log("5. 컨트롤러 호출 ");
    const { accessOption, refreshOption } = this.authService.getCookiesForLogOut();
    await this.usersService.removeRefreshToken(req.body.email);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);

    return HttpStatus.OK;
  }

  @UseGuards(JwtStrategy)
  @Get("/refresh")
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.body;
    console.log(user);
    const { accessToken: access_token, ...accessOption } = await this.authService.login(user.email);
    res.cookie("Authentication", access_token);

    return user;
  }

  @UseGuards(JwtStrategy)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {
    return;
  }

  @Public()
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
  @Public()
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
