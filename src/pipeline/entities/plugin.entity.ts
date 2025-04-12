import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  config: Record<string, any>;

  @Column({ default: 'builtin' })
  type: 'builtin' | 'custom';

  @Column({ nullable: true })
  icon: string; // 可选：图标路径

  @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at: Date;
}
