import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { VerifyEmailDto } from "src/email/dto/verify-email.dto";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { CustomGuard } from "./passsport/custom.guard";
import { JwtAuthGuard } from "./passsport/jwt-auth.guard";
import { LocalAuthGuard } from "./passsport/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // 이름과 패스워드 받아서 로그인
  // auth 처리가 안되어있기 때문에 에러
  //   @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req) {
    console.log(req);
    return this.authService.login(req.user.email, req.user.password);
  }

  // passport-local strategy를 채택하도록 하고, Passport가 validate()메서드를 통해 자동으로 user object를 생성하고 Request object에 이를 할당해준다.
  // 이름과 패스워드 받아서 로그인
  // @UseGuards(AuthGuard('local'))
  // @Post('/alogin')
  // async alogin(@Request() req){
  //     return this.authService.login(req);
  // }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(CustomGuard)
  @Get(":custom/login")
  getHello(): string {
    return "hi";
  }

  @Post("/getToken")
  getToken(
    @Query("email") email: string,
    @Query("password") password: string,){
    return this.authService.login(email, password);
  }

  // 가입 확인 인증 진행
  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    console.log(dto);
    console.log(signupVerifyToken);

    // jwt토큰을 리턴합니다. 클라이언트는 jwt를 저장한 후 리소스를 요청할때 함께 전달합니다.
    return await this.authService.verifyEmail(signupVerifyToken);
  }

  // Bearer Token에 발급받은 JWT Token으로 해당 토큰을 통해 유저의 정보를 확인하고
  // 유저의 정보를 반환한다.
  // 이 과정을 Guard를 사용해 JWT Token 인증과정이 여러 엔드포인트에서도 사용될 수 있도록 처리한다.
  @UseGuards(CustomGuard)
  @Get(":email")
  async getUserInfo(
    @Param("email") email: string,
  ): Promise<string> {
    // const jwtString = headers.authorization.split("Bearer ")[1];

    // this.authService.verify(jwtString);

    return this.usersService.getUserInfo(email);
  }
}
