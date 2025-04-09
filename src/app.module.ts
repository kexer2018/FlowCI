import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { JenkinsModule } from './jenkins/jenkins.module';

@Module({
  imports: [UserModule, ProjectModule, PipelineModule, JenkinsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
