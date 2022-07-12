import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as uuid from "uuid";
import { EmailService } from "src/email/email.service";
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
   * 유저 데이터 생성
   * @param userData
   * @returns
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const { email, username, password } = userData;
    let user = await this.usersRepository.findOne({ where: { email: email } });
    if (user) {
      throw new UnprocessableEntityException("E-Mail already exist");
    }
    // uuid를 사용해 랜덤한 데이터로 토큰화하고, 이메일 인증에서 사용
    const signupVerifyToken = uuid.v1();

    user = new User();
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
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    } finally {
      // 직접 생성한 queryRunner는 해제해주어야 함.
      await queryRunner.release();
    }

    try {
      // 가입 확인 메일 전송
      await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException("가입 확인 이메일 발송 중 오류");
    }

    return user;
  }

  /**
   * 리프레시 토큰을 해쉬함수로 변환해서 DB에 업데이트
   * @param refreshToken
   * @param id
   */
  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await this.setHashToken(refreshToken);
    console.log(currentHashedRefreshToken);
    await this.usersRepository.update(
      { email: email },
      {
        currentHashedRefreshToken: currentHashedRefreshToken,
      }
    );
    return currentHashedRefreshToken;
  }

  /**
   * 유저의 고유 번호를 이용하여 데이터를 조회하고 Refresh Token이 유효한지 확인
   * DB에 저장된 토큰은 암호화가 되어있기 때문에 bcrypt의 compare 메소드를 이용하여 비교하고 일치한다면 해당 유저 정보를 반환
   * @param refreshToken
   * @param email
   * @returns
   */
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.findByEmail(email);

    const isRefreshTokenMatching = await compare(refreshToken, user.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  /**
   * 로그아웃 시 리프레쉬 토큰 삭제
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

  /**
   *  유저 패스워드가 유효한지 확인함
   * @param userPassword
   * @param password
   * @returns
   */
  public isPasswordValid(userPassword: string, password: string): boolean {
    return bcrypt.compareSync(userPassword, password);
  }

  /**
   *  유저 패스워드를 인코딩함
   * @param password
   * @returns
   */
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public async setHashToken(token: string) {
    return hash(token, 10);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findByName(username: string): Promise<User | undefined> {
    const user = this.usersRepository.findOne({ where: { username } });
    if (user) {
      return user;
    }
    throw new HttpException("User with this name does not exist", HttpStatus.NOT_FOUND);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException("User with this email does not exist", HttpStatus.NOT_FOUND);
  }
  async findBySignupVerifyToken(signupVerifyToken: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken: signupVerifyToken },
    });
    if (user) {
      return user;
    }
    throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
  }

  update(updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto.username} user`;
  }

  remove(username: string) {
    this.usersRepository.delete(username);
  }
}
