import { UnprocessableEntityException } from "@nestjs/common";
import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ExclusionMetadata } from "typeorm/metadata/ExclusionMetadata";
import { LocalAuthenticaionEntity } from "./localAuthenticaion.entity";

@Entity("user")
export class UserEntity {
  @PrimaryColumn()
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
  @Exclude()
  currentHashedRefreshToken?: string;

  // House(1) <-> Image(*)
  @OneToOne(() => LocalAuthenticaionEntity, localAuth => localAuth.user)
  localAuth: LocalAuthenticaionEntity;
}
