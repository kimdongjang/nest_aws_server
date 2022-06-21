import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class SocialAuthentication {
  @OneToOne(() => User, user => user.email)
  @JoinColumn()
  @PrimaryColumn("varchar", { primary: true, length: 255, unique: true })
  email: string;

  @Column()
  platform: string;

  @Column()
  snsServiceId: string;
}
