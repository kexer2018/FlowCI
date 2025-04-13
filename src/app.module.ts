import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './pipeline/pipeline.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, PipelineModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
