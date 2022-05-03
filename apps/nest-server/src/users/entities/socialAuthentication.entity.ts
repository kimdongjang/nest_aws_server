import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("socialAuthentication")
export class SocialAuthenticationEntity {
  @PrimaryColumn()
  email!: string;
  @Column()
  platform: string;
  @Column()
  sns_service_id: string;
}
