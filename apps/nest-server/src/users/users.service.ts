import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import * as uuid from "uuid";
import { EmailService } from "src/email/email.service";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UsersService {
  constructor(
    // repository 사용을 위해 @InjectRepository로 Service와 User와 의존관계를 주입한다.
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private connection: Connection,
    private emailService: EmailService
  ) {}

  /**
   * 입력받은 이메일로 이메일 존재여부확인
   * @param emailAddress
   * @returns
   */
  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = this.usersRepository.findOne({
      where: { email: emailAddress },
    });
    const val = user.then(v => {
      return v === null;
    });
    return val;
  }

  // /**
  //  * 토큰으로 이메일 검사
  //  * @param signupVerifyToken
  //  * @returns
  //  */
  // async verifyEmail(signupVerifyToken: string) {
  //   // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
  //   const user = await this.findByToken(signupVerifyToken);
  //   console.log(user)

  //   if (!user) {
  //       throw new NotFoundException('유저가 존재하지 않습니다');
  //   }

  //   // 2. 바로 로그인 상태가 되도록 JWT를 발급
  //   return this.authService.login(
  //       user.email, user.password,
  //   );
  // }

  /**
   * 유저 데이터 생성
   * @param userData
   * @returns
   */
  async create(userData: CreateUserDto): Promise<UserEntity> {
    const { email, username, password } = userData;
    const userExist = await this.checkUserExists(email);
    if (!userExist) {
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다."
      );
    }
    const signupVerifyToken = uuid.v1();
    const user = new UserEntity();
    user.email = email;
    user.password = password;
    user.username = username;
    user.isactive = false;
    user.signupVerifyToken = signupVerifyToken;

    // user 정보 저장시 트랜지션 적용
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 트랜잭션으로 유저 정보 저장
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      // 가입 확인 메일 전송
      await this.emailService.sendMemberJoinVerification(
        email,
        signupVerifyToken
      );
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException(
        "해당 이메일로는 가입할 수 없습니다."
      );
    } finally {
      // 직접 생성한 queryRunner는 해제해주어야 함.
      await queryRunner.release();
    }

    return user;
  }

  async getUserInfo(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findByName(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = this.usersRepository.findOne({ where: { email: email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this email does not exist",
      HttpStatus.NOT_FOUND
    );
  }
  async findByToken(
    signupVerifyToken: string
  ): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({
      where: { signupVerifyToken: signupVerifyToken },
    });
  }

  async findByEmailPw(
    email: string,
    password: string
  ): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({
      where: { email: email, password: password },
    });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${username} user`;
  }

  remove(username: string) {
    this.usersRepository.delete(username);
  }
}
