import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('template')
export class TemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'system' })
  createBy: string;

  @Column({ type: 'json' })
  stages: any;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateAt: Date;
}
