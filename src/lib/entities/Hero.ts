import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  subtitle!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  cta_text?: string;

  @Column('text', { nullable: true })
  cta_link?: string;

  @Column('text', { nullable: true })
  badge_text?: string;

  @Column('text', { nullable: true })
  image_url?: string;

  @Column('boolean', { default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
