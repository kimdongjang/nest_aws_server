import { UnprocessableEntityException } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    email: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    isactive: boolean;
}
