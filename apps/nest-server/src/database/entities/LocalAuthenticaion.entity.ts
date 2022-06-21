import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class LocalAuthenticaion {
  @OneToOne(() => User, user => user.email)
  @JoinColumn()
  @PrimaryColumn("varchar", { primary: true, length: 255, unique: true })
  email: string;

  @Column()
  password: string;
}
