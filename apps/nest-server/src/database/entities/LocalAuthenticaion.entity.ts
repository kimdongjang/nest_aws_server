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
  @PrimaryColumn("varchar", { primary: true, name: "email", length: 255, unique: true })
  email: string;

  @Column()
  password: string;
}
