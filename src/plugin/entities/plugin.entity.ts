import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plugin')
export class PluginEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  config: string;

  @Column({ default: 'builtin' })
  type: 'builtin' | 'custom';

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true, default: 'system' })
  createBy: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateAt: Date;
}
