import { Module } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { JenkinsController } from './jenkins.controller';

@Module({
  controllers: [JenkinsController],
  providers: [JenkinsService],
})
export class JenkinsModule {}
