import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['builtin', 'custom'],
    default: 'custom',
  })
  type: 'builtin' | 'custom';

  @Column()
  language: string;

  @Column()
  created_by: string;

  @Column({ type: 'jsonb' })
  config: string;

  @Column({ nullable: true })
  template_id: string;

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
