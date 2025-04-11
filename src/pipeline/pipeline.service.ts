// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreatePipelineDto } from './dto/create-pipeline.dto';
// import { UpdatePipelineDto } from './dto/update-pipeline.dto';
// import { Pipeline } from './entities/pipeline.entity';
// import { PipelineConfig } from './interface/pipeline';

// @Injectable()
// export class PipelineService {
//   private config: PipelineConfig;

//   constructor(
//     @InjectRepository(Pipeline)
//     private readonly pipelineRepository: Repository<Pipeline>,
//   ) {}

//   async getTemplateList(username: string) {
//     return await this.pipelineRepository.find({
//       where: {
//         created_by: username,
//       },
//     });
//   }

//   async getTemplate(id: number) {
//     return await this.pipelineRepository.findOne()
//   }
//   }
//   // 获取列表
//   // async getList(username: string): Promise<Stage[]> {
//   //   return [];
//   // }

//   // 获取某个具体模板的信息
//   async get(id: string) {
//     return { id };
//   }

//   // 更新模板的信息
//   async update(id: string, updatePipelineDto: UpdatePipelineDto) {
//     return { id, updatePipelineDto };
//   }

//   // 用户自定义模板
//   async create(createPipelineDto: CreatePipelineDto) {
//     return { createPipelineDto };
//   }

//   // 创建流水线
//   async createPipeline() {
//     return {};
//   }

//   // 构建
//   async build(name: string) {
//     return name;
//   }

//   async getBuildHistory() {}
// }
