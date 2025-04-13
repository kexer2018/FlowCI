import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from './entities/pipeline.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(Pipeline)
    private readonly pipelineRepo: Repository<Pipeline>,
  ) {}

  async create(dto: CreatePipelineDto): Promise<Pipeline> {
    const pipeline = this.pipelineRepo.create(dto);
    return this.pipelineRepo.save(pipeline);
  }

  async update(id: string, dto: UpdatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.pipelineRepo.findOne({ where: { id } });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    Object.assign(pipeline, dto);
    return this.pipelineRepo.save(pipeline);
  }

  async findOne(id: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepo.findOne({ where: { id } });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async findAll(): Promise<Pipeline[]> {
    return this.pipelineRepo.find();
  }

  async delete(id: string): Promise<void> {
    await this.pipelineRepo.delete(id);
  }
}
