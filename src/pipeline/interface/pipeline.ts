import { PipelineStage } from './stage';
import { PipelineAgent } from './agent';
import { PipelineOption } from './options';
import { PipelineTrigger } from './trigger';
import { PipelinePost } from './post';

export interface PipelineConfig {
  agent: PipelineAgent;
  environment?: Record<string, string>;
  tools?: Record<string, string>;
  options?: PipelineOption;
  stages: PipelineStage[];
  triggers?: PipelineTrigger;
  post?: PipelinePost[];
}
