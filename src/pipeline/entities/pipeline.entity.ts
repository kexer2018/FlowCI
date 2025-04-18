import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// import { PipelineStage } from 'src/template/interface/stage';

@Entity('pipeline')
export class PipelineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  language: string;

  @Column()
  createBy: string;

  @Column({ type: 'jsonb' })
  config: any;

  @Column()
  templateId: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateAt: Date;
}
