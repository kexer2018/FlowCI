import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineEntity } from './entities/pipeline.entity';

@Controller('pipelines')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  async create(@Body() dto: CreatePipelineDto): Promise<PipelineEntity> {
    return await this.pipelineService.create(dto);
  }

  @Get()
  findAll(): Promise<PipelineEntity[]> {
    return this.pipelineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PipelineEntity> {
    return this.pipelineService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePipelineDto,
  ): Promise<PipelineEntity> {
    return this.pipelineService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.pipelineService.delete(id);
  }
}
