import { Module } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JenkinsService],
  exports: [JenkinsService],
})
export class JenkinsModule {}
