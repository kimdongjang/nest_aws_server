import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LocalAuthenticaion } from "./LocalAuthenticaion.entity";
import { SocialAuthentication } from "./SocialAuthentication.entity";

@Entity()
export class User {
  @PrimaryColumn({ primary: true, type: "varchar", length: 200, unique: true })
  email: string;
  @Column()
  username: string;
  /**
   * Exclude() : JSON 직렬화 대상에서 제외함. private 변수라도 직렬화를 시킬 수가 있어 보안적인 측면에선 제외해야 함.
   */
  @Exclude()
  @Column()
  password: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @Column({ default: false })
  isactive: boolean;
  @Column()
  signupVerifyToken: string;
  @Column({ nullable: true })
  currentHashedRefreshToken?: string;
}
