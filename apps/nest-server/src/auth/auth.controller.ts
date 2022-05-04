import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { VerifyEmailDto } from "src/email/dto/verify-email.dto";
import { Public } from "src/skip-auth.decorator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { CustomGuard } from "./passsport/custom.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { User } from "src/database/entities/User.entity";

@ApiTags("AuthApi")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @Post("/create")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  // 이메일과 패스워드 받아서 로그인. jwt토큰에 user 정보를 받아서 json으로 리턴.
  // UseGuards에서 이름을 참조해 passport-local패키지에서 제공하는 코드와 연결
  // @UseGuards(AuthGuard("local"))
  @Public()
  @Post("/login")
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user = req.body;

    // user 이메일을 통해 user 데이터를 조회후 jwt토큰으로 변경
    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtAccessToken(user.email);

    const { refreshToken, ...refreshOption } =
      await this.authService.getCookieWithJwtRefreshToken(user.email);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.email);

    // 쿠키에 jwt토큰과 refresh 토큰을 저장
    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);

    return user;

    // //  이메일과 패스워드 받아서 로그인. jwt 토큰 반환
    // const { access_token, ...option } = await this.authService.login(req.body);
    // console.log(access_token);
    // console.log(option);
    // // jwt 토큰 쿠키에 저장
    // res.cookie("Authentication", access_token, option);
  }

  @UseGuards(JwtRefreshGuard)
  @Post("/logout")
  async logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    // const { access_token, ...option } = await this.authService.logOut();
    // res.cookie("Authentication", access_token, option);
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.usersService.removeRefreshToken(req.body.email);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);

    return 1;
  }

  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.body;
    console.log(user);
    const { accessToken, ...accessOption } =
      await this.authService.getCookieWithJwtAccessToken(user.email);
    res.cookie("Authentication", accessToken, accessOption);
    return user;
  }

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
  googleAuthRedirect(@Req() req) {
    console.log(req);
    const res = this.authService.googleLogin(req);
    // console.log(res);
    return res;
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
