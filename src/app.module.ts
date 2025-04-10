import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PipelineModule } from './pipeline/pipeline.module';
// import { JenkinsModule } from './jenkins/jenkins.module';
// import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule, PipelineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
