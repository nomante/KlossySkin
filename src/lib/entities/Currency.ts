import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "currencies" })
export class CurrencyEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 8, unique: true })
  code!: string;

  @Column({ type: "varchar", length: 8, nullable: true })
  symbol?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}