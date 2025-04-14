import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineEntity } from './entities/pipeline.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { JenkinsService } from 'src/jenkins/jenkins.service';
import { PipelineBuilder } from './utils/pipeline.builder';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(PipelineEntity)
    private readonly pipelineRepo: Repository<PipelineEntity>,

    private readonly jenkinsService: JenkinsService,
    private readonly pipelineBuilder: PipelineBuilder,
  ) {}

  async create(dto: CreatePipelineDto): Promise<PipelineEntity> {
    const pipeline = this.pipelineRepo.create(dto);
    const saved = await this.pipelineRepo.save(pipeline);

    const jobName = saved.name;
    this.pipelineBuilder.addStage(saved.config);
    const pipelineScript = this.pipelineBuilder.generate();
    console.log('pipeline', pipelineScript, 'JobName', jobName);
    // const jobXml = this.pipelineBuilder.toXml(saved.config);
    // await this.jenkinsService.createJob(jobName, jobXml);
    return saved;
  }

  async update(id: string, dto: UpdatePipelineDto): Promise<PipelineEntity> {
    const pipeline = await this.pipelineRepo.findOne({ where: { id } });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    Object.assign(pipeline, dto);
    return this.pipelineRepo.save(pipeline);
  }

  async findOne(id: string): Promise<PipelineEntity> {
    const pipeline = await this.pipelineRepo.findOne({ where: { id } });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async findAll(): Promise<PipelineEntity[]> {
    return this.pipelineRepo.find();
  }

  async delete(id: string): Promise<void> {
    await this.pipelineRepo.delete(id);
  }

  async build(name: string): Promise<void> {
    await this.jenkinsService.jobBuild(name);
  }
}
