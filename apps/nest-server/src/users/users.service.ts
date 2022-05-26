import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as uuid from "uuid";
import { EmailService } from "src/email/email.service";
import { AuthService } from "src/auth/auth.service";
import { compare, hash } from "bcrypt";
import { User } from "src/database/entities/User.entity";
import { LocalAuthenticaion } from "src/database/entities/LocalAuthenticaion.entity";
import { SocialAuthentication } from "src/database/entities/SocialAuthentication.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    // repository 사용을 위해 @InjectRepository로 Service와 User와 의존관계를 주입한다.
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LocalAuthenticaion)
    private localAuthRepository: Repository<LocalAuthenticaion>,
    @InjectRepository(SocialAuthentication)
    private socialAuthRepository: Repository<SocialAuthentication>,
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

    if (!user) {
      return false;
    }
    return true;
  }

  /**
   * 유저 데이터 생성
   * @param userData
   * @returns
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, username, password } = userData;

    const userExist = await this.checkUserExists(email);
    console.log("userExist " + userExist);

    if (!userExist) {
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    }
    const signupVerifyToken = uuid.v1();

    const user = new User();
    user.email = email;
    user.username = username;
    user.isactive = false;
    user.signupVerifyToken = signupVerifyToken;
    user.password = this.encodePassword(password);

    const localAuth = new LocalAuthenticaion();
    localAuth.email = user.email;
    localAuth.password = password;

    // user 정보 저장시 트랜지션 적용
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 트랜잭션으로 유저 정보 저장
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(localAuth);

      await queryRunner.commitTransaction();

      // 가입 확인 메일 전송
      await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    } finally {
      // 직접 생성한 queryRunner는 해제해주어야 함.
      await queryRunner.release();
    }

    return user;
  }

  // 유저 패스워드를 인코딩함
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * 리프레시 토큰을 해쉬함수로 변환해서 DB에 업데이트
   * @param refreshToken
   * @param id
   */
  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    console.log(currentHashedRefreshToken);
    await this.usersRepository.update(
      { email: email },
      {
        currentHashedRefreshToken: currentHashedRefreshToken,
      }
    );
  }

  /**
   * 리프레쉬 토큰이 일치하는지 확인
   * @param refreshToken
   * @param email
   * @returns
   */
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.findByEmail(email);
    console.log(user);

    const isRefreshTokenMatching = await compare(refreshToken, user.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async removeRefreshToken(email: string) {
    return this.usersRepository.update(
      { email: email },
      {
        currentHashedRefreshToken: null,
      }
    );
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findByName(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.usersRepository.findOne({ where: { email: email } });
    if (user) {
      return user;
    }
    throw new HttpException("User with this email does not exist", HttpStatus.NOT_FOUND);
  }
  async findByToken(signupVerifyToken: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { signupVerifyToken: signupVerifyToken },
    });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${username} user`;
  }

  remove(username: string) {
    this.usersRepository.delete(username);
  }
}
