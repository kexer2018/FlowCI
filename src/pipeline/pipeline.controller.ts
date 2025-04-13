// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { PipelineService } from './pipeline.service';
// import { CreatePipelineDto } from './dto/create-pipeline.dto';

// @Controller('pipeline')
// export class PipelineController {
//   constructor(private readonly pipelineService: PipelineService) {}

//   // 获取所有内置模版
//   @Get('templates')
//   getAllTemplates() {
//     return this.pipelineService.getAllTemplates();
//   }

//   // 获取某个指定模版
//   @Get('templates/:id')
//   getTemplateById(@Param('id') id: string) {
//     return this.pipelineService.getTemplateById(id);
//   }

//   // 获取所有插件列表
//   @Get('plugins')
//   getAllPlugins() {
//     return this.pipelineService.getAllPlugins();
//   }

//   // 获取某个插件信息
//   @Get('plugins/:id')
//   getPluginByName(@Param('id') id: string) {
//     return this.pipelineService.getPluginByName(id);
//   }

//   @Post()
//   createPipeline(config:CreatePipelineDto)

//   @Put()
//   updatePipeline(@Body(),id:string){

//   }
// }
import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  createPipeline(@Body() dto: CreatePipelineDto) {
    return this.pipelineService.create(dto);
  }

  @Put(':id')
  updatePipeline(@Param('id') id: string, @Body() dto: UpdatePipelineDto) {
    return this.pipelineService.update(id, dto);
  }

  @Get(':id')
  getPipeline(@Param('id') id: string) {
    return this.pipelineService.findOne(id);
  }

  @Get()
  listPipelines() {
    return this.pipelineService.findAll();
  }

  @Delete(':id')
  deletePipeline(@Param('id') id: string) {
    return this.pipelineService.delete(id);
  }
}
