import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LocalAuthenticaion } from "./LocalAuthenticaion.entity";
import { SocialAuthentication } from "./SocialAuthentication.entity";

@Entity()
export class User {
  @PrimaryColumn({ type: "varchar", length: 200, unique: true })
  email: string;
  @Column()
  username: string;
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
