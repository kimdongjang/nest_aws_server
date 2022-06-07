import { Exclude } from "class-transformer";
import { User } from "src/database/entities/User.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, user => user.email)
  @JoinColumn()
  @PrimaryColumn("varchar", { primary: true, name: "email", length: 255, unique: true })
  email: string;
}
