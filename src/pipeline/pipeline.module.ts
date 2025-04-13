import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Pipeline } from './entities/pipeline.entity';
import { PipelineController } from './pipeline.controller';

@Module({
  // imports: [TypeOrmModule.forFeature([Pipeline])],
  controllers: [PipelineController],
  providers: [PipelineService],
})
export class PipelineModule {}
