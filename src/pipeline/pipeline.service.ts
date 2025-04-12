import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreatePipelineDto } from './dto/create-pipeline.dto';
// import { UpdatePipelineDto } from './dto/update-pipeline.dto';
// import { Pipeline } from './entities/pipeline.entity';
import { PipelineConfig } from './interface/pipeline';
import { BuiltInCache, Template } from 'src/common';

@Injectable()
export class PipelineService {
  async getTemplateList(): Promise<Template[]> {
    // return await this.pipelineRepository.find({
    //   where: {
    //     created_by: username,
    //   },
    // });
    const templateMap = BuiltInCache.templates.values();
    return Array.from(templateMap);
  }

  async getTemplate(id: string) {
    return BuiltInCache.templates.get(id);
  }

  async createTemplate() {
    // 写入数据库中
  }

  async createPipeline() {
    return {};
  }
}
