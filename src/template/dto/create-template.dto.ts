import { PipelineStage } from '../interface/stage';
export class CreateTemplateDto {
  name: string;
  label: string;
  type: string;
  description?: string;
  createBy: string;
  stages: PipelineStage[];
}
