import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { compare, hash } from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { User } from "src/database/entities/User.entity";
import { UserLoginDto } from "src/users/dto/login-user.dto";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";

// username과 password를 통해 인증을 진행
// 한번 인증되었다면 서버는 특정 request에서 인증 상태를 확인하기 위해 jwt를 발급
// 유효한 jwt를 가지고 있는 request만 접근할 수 있는 protected routes를 생성
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService, private configService: ConfigService) {}

  /**
   * 구글로 로그인했을시의 서비스
   * @param req
   * @returns
   */
  async googleLogin(req) {
    // console.log(req.user);

    const accessToken = this.jwtService.sign(
      { user: req.user },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")),
      }
    );

    const refreshToken = this.jwtService.sign(
      { user: req.user },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN__SECRET"),
        expiresIn: Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")),
      }
    );
    await this.usersService.setCurrentRefreshToken(refreshToken, req.user.email);

    return {
      // access_token: this.jwtService.sign(JSON.stringify(payload), this.configService.get("JWT_ACCESS_TOKEN_SECRET")),
      domain: this.configService.get("DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME") * 1000),
      status: HttpStatus.ACCEPTED,
      data: req.user,
      error: "",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    // if (!data.user) throw new BadRequestException();

    // const user = await this.usersService.findByEmail(data.user.email);
    // if (user) return this.login(user);

    // // user = this.usersService.findByEmail(data.user.email);
    // // if (user) throw new ForbiddenException("User already exists, but Google account was not connected to user's account");

    // // try {
    // //   const newUser = new User();
    // //   newUser.firstName = data.user.firstName;
    // //   newUser.lastName = data.user.lastName;
    // //   newUser.email = data.user.email;
    // //   newUser.googleId = data.user.id;

    // //   await this.usersService.store(newUser);
    // //   return this.login(newUser);
    // // } catch (e) {
    // //   throw new Error(e);
    // // }
    // return user;
  }

  /**
   * 유저 데이터를 생성할때 hash값으로 패스워드를 생성
   * @param user
   * @returns
   */
  async register(userData: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(userData);
      if (!user) {
        return {
          domain: this.configService.get("DOMAIN"),
          path: "/",
          httpOnly: true,
          maxAge: 0,
          status: HttpStatus.CREATED,
          data: null,
          accessToken: null,
          refreshToken: null,
        };
      }
    } catch (error) {
      throw new UnprocessableEntityException("User with that email already exits");
    }
  }

  /**
   * local.stragtegy에서 정의한 email과 password로 validate를 검사하는 과정을 진행하며 jwt 토큰이 포함된 로그인 정보를 리턴함
   * @param user UserLoginDto(email, password)
   * @returns  jwt 액세스 토큰이 포함된 로그인 정보를 리턴
   */
  async login(userLoginDto: UserLoginDto) {
    const user = await this.usersService.findByEmail(userLoginDto.email);
    if (!user) {
      return {
        domain: this.configService.get("DOMAIN"),
        path: "/",
        httpOnly: true,
        maxAge: 0,
        status: HttpStatus.NOT_FOUND,
        data: null,
        error: ["E-Mail not found"],
        accessToken: null,
        refreshToken: null,
      };
    }

    const isPasswordValid: boolean = await this.usersService.isPasswordValid(userLoginDto.password, user.password);
    if (!isPasswordValid) {
      return {
        domain: this.configService.get("DOMAIN"),
        path: "/",
        httpOnly: true,
        maxAge: 0,
        status: HttpStatus.NOT_FOUND,
        data: null,
        error: ["Password wrong"],
        accessToken: null,
        refreshToken: null,
      };
    }

    const accessToken = this.jwtService.sign(
      { user: user },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")),
      }
    );

    const refreshToken = this.jwtService.sign(
      { user: user },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN__SECRET"),
        expiresIn: Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")),
      }
    );
    await this.usersService.setCurrentRefreshToken(refreshToken, user.email);

    return {
      // access_token: this.jwtService.sign(JSON.stringify(payload), this.configService.get("JWT_ACCESS_TOKEN_SECRET")),
      domain: this.configService.get("DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME") * 1000),
      status: HttpStatus.ACCEPTED,
      data: user,
      error: "",
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  /**
   * 로그아웃. 액세스 토큰 빈공간 처리
   * @returns
   */
  async logOut() {
    return {
      access_token: "",
      domain: this.configService.get("DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: 0,
    };
  }

  /**
   * user를 검색하고 패스워드가 맞는지 확인해서 반환함
   * @param email
   * @param password
   * @returns
   */
  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    try {
      console.log(email);
      console.log(plainTextPassword);
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      const { ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 패스워드 검사
   * @param plainTextPassword 입력 패스워드
   * @param hashedPassword DB 패스워드
   */
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatch = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatch) {
      throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 토큰으로 이메일 검사
   * @param signupVerifyToken
   * @returns
   */
  async verifyEmail(signupVerifyToken: string) {
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    const user = await this.usersService.findBySignupVerifyToken(signupVerifyToken);

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    return this.login(user);
  }

  /**
   * jwt token을 디코딩함
   */
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token);
  }

  /**
   * jwt 토큰으로 검사
   * @param jwtToken
   * @returns
   */
  verify(jwtToken: string) {
    try {
      const payload = this.jwtService.verify(jwtToken, this.configService.get("JWT_ACCESS_TOKEN_SECRET"));

      return payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  /**
   * jwt 액세스 토큰을 가져온다.
   * @param email
   * @returns
   */
  async getCookieWithJwtAccessToken(email: string) {
    const payload = { email };
    // const payload = await this.usersService.findByEmail(email);
    // return this.login(payload);

    const token = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: `${this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`,
      }
    );

    return {
      accessToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")),
    };
  }

  /**
   * 리프레쉬 토큰을 발급. 리프레쉬 토큰은 DB에 저장
   * @param id
   * @returns
   */
  async getCookieWithJwtRefreshToken(email: string) {
    const payload = { email };
    // const user = await this.usersService.findByEmail(email);

    const refreshToken = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN__SECRET"),
        expiresIn: Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")),
      }
    );

    return {
      refreshToken: refreshToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge: Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")),
    };
  }

  /**
   * 로그아웃시 쿠키에 빈 쿠기를 만들기 위한 값을 반환
   * @returns
   */
  async getCookiesForLogOut(email: string) {
    await this.usersService.removeRefreshToken(email);
    return {
      accessOption: {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}
