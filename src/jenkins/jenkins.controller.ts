import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { PipelineService } from '../pipeline/pipeline.service';

@Controller('jenkins')
export class JenkinsController {
  @Inject(JenkinsService)
  private readonly jenkinsService: JenkinsService;

  @Inject(PipelineService)
  private readonly pipelineService: PipelineService;

  @Get('list')
  async list() {
    return [];
  }
}
