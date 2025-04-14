import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './pipeline/pipeline.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TemplateModule } from './template/template.module';
import { JenkinsModule } from './jenkins/jenkins.module';
import { ConfigModule } from '@nestjs/config';
import { PluginModule } from './plugin/plugin.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'),
      cache: true,
    }),
    DatabaseModule,
    PipelineModule,
    UserModule,
    TemplateModule,
    JenkinsModule,
    PluginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
