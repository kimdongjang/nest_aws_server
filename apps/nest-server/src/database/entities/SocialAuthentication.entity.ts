import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class SocialAuthentication {
  @OneToOne(() => User)
  @PrimaryColumn("varchar", { primary: true, name: "email", length: 255 })
  email: string;

  @Column()
  platform: string;

  @Column()
  snsServiceId: string;
}
