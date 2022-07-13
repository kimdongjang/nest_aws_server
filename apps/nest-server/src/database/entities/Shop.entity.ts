import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * 가게 id, name, 위치(zipid), 홈페이지 링크, 전화번호, etc
 */
@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  addressName: string;
  @Column()
  loadAddressName: string;
  @Column()
  homepageLink: string;
  @Column()
  callNumber: string;
  @Column()
  categoryGroupCode: string;
  @Column()
  categoryGroupName: string;
  @Column()
  categoryName: string;
  @UpdateDateColumn()
  updateAt: Date;
  @Column()
  lng: number;
  @Column()
  lat: number;
}
