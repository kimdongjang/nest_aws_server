import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("localAuthenticaion")
export class LocalAuthenticaionEntity {
  @PrimaryColumn()
  email: string;
  @Column()
  password: string;

  @OneToOne(type => UserEntity, user => user.localAuth)
  @JoinColumn()
  user: UserEntity;
}
