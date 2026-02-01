import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "numeric" })
  price!: number;

  @Column({ type: "varchar", length: 8, default: "USD" })
  currency!: string;

  @Column({ type: "text" })
  image!: string;

  @Column({ type: "varchar", length: 120 })
  category!: string;

  @Column({ type: "int" })
  stock!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}