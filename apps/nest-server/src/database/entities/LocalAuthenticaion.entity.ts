import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity()
export class LocalAuthenticaion {
  @OneToOne(() => User)
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;
}
