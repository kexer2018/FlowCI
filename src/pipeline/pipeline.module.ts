import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineEntity } from './entities/pipeline.entity';
import { PipelineController } from './pipeline.controller';
import { JenkinsModule } from 'src/jenkins/jenkins.module';
import { PipelineBuilder } from './utils/pipeline.builder';

@Module({
  imports: [TypeOrmModule.forFeature([PipelineEntity]), JenkinsModule],
  controllers: [PipelineController],
  providers: [PipelineService, PipelineBuilder],
})
export class PipelineModule {}
