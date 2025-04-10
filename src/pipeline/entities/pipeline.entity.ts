import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'custom' })
  type: 'builtin' | 'custom';

  @Column()
  language: string;

  @Column()
  created_by: string;

  @Column({ type: 'jsonb' })
  config: Record<string, any>;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'NOW()',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'NOW()',
  })
  updated_at: Date;
}
