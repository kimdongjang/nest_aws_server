import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as jwt from "jsonwebtoken";
import { UserEntity } from "src/users/entities/user.entity";
import { compare, hash } from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";

// username과 password를 통해 인증을 진행
// 한번 인증되었다면 서버는 특정 request에서 인증 상태를 확인하기 위해 jwt를 발급
// 유효한 jwt를 가지고 있는 request만 접근할 수 있는 protected routes를 생성
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  /**
   * 구글로 로그인했을시의 서비스
   * @param req
   * @returns
   */
  googleLogin(req) {
    if (!req.user) {
      return "No user from google";
    }
    return {
      message: "User information from google",
      user: req.user,
    };
  }

  // local.stragtegy에서 정의한 email과 password로 validate를 검사하는 과정을 진행함
  async login(user: UserEntity) {
    const payload = await this.usersService.findByEmail(user.email);
    const token = {
      access_token: jwt.sign(
        JSON.stringify(payload),
        this.configService.get("JWT_ACCESS_TOKEN_SECRET")
      ),
      domain: this.configService.get("DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge:
        Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")) *
        1000,
    };

    return token;
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
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 패스워드 검사
   * @param plainTextPassword 입력 패스워드
   * @param hashedPassword DB 패스워드
   */
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatch = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatch) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 유저 데이터를 생성할때 hash값으로 패스워드를 생성
   * @param user
   * @returns
   */
  async register(userData: CreateUserDto) {
    const hashedPassword = await hash(userData.password, 10);
    try {
      const { password, ...returnUser } = await this.usersService.create({
        ...userData,
        password: hashedPassword,
      });
      return returnUser;
    } catch (error) {
      if (error?.code === "ER_DUP_ENTRY") {
        throw new HttpException(
          "User with that email already exits",
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  /**
   * 토큰으로 이메일 검사
   * @param signupVerifyToken
   * @returns
   */
  async verifyEmail(signupVerifyToken: string) {
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    const user = await this.usersService.findByToken(signupVerifyToken);

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    return this.login(user);
  }

  /**
   * jwt 토큰으로 검사
   * @param jwtString
   * @returns
   */
  verify(jwtString: string) {
    try {
      const payload = jwt.verify(
        jwtString,
        this.configService.get("JWT_ACCESS_TOKEN_SECRET")
      ) as (jwt.JwtPayload | string) & UserEntity;

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
    // const payload = { email };
    const payload = await this.usersService.findByEmail(email);
    const token = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: `${this.configService.get(
          "JWT_ACCESS_TOKEN_EXPIRATION_TIME"
        )}s`,
      }
    );

    return {
      accessToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge:
        Number(this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")) *
        1000,
    };
  }

  /**
   * 리프레쉬 토큰을 발급. 리프레쉬 토큰은 DB에 저장
   * @param id
   * @returns
   */
  async getCookieWithJwtRefreshToken(email: string) {
    // const payload = { email };
    const payload = await this.usersService.findByEmail(email);

    const token = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: `${this.configService.get(
          "JWT_REFRESH_TOKEN_EXPIRATION_TIME"
        )}s`,
      }
    );

    return {
      refreshToken: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      maxAge:
        Number(this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")) *
        1000,
    };
  }

  /**
   * 로그아웃시 쿠키에 빈 쿠기를 만들기 위한 값을 반환
   * @returns
   */
  getCookiesForLogOut() {
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
