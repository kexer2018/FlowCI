import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';

@Module({
  controllers: [PipelineController],
  providers: [PipelineService],
})
export class PipelineModule {}
