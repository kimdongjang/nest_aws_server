import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column('varchar', { length: 30 })
    title!: string;    
    @Column()
    price!: number;
}