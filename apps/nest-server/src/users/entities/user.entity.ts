import { UnprocessableEntityException } from "@nestjs/common";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ExclusionMetadata } from "typeorm/metadata/ExclusionMetadata";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ default: false })
  isactive: boolean;
  @Column()
  signupVerifyToken: string;
  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
