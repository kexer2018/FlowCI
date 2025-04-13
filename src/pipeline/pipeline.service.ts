// import { Injectable, NotFoundException } from '@nestjs/common';
// import { BuiltInCache } from 'src/common';

// @Injectable()
// export class PipelineService {
//   getAllTemplates() {
//     return BuiltInCache.templates
//       .keys()
//       .map((key) => BuiltInCache.templates.get(key));
//   }

//   getTemplateById(id: string) {
//     const template = BuiltInCache.templates.get(id);
//     if (!template) throw new NotFoundException(`Template ${id} not found`);
//     return template;
//   }

//   getAllPlugins() {
//     return BuiltInCache.plugins
//       .keys()
//       .map((key) => BuiltInCache.plugins.get(key));
//   }

//   getPluginByName(name: string) {
//     const plugin = BuiltInCache.plugins.get(name);
//     if (!plugin) throw new NotFoundException(`Plugin ${name} not found`);
//     return plugin;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineEntity } from './entities/pipeline.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(PipelineEntity)
    private readonly pipelineRepo: Repository<PipelineEntity>,
  ) {}

  async create(dto: CreatePipelineDto): Promise<PipelineEntity> {
    const pipeline = this.pipelineRepo.create(dto);
    return this.pipelineRepo.save(pipeline);
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
}
