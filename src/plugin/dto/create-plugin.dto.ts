import { PipelineStep } from '../../template/interface/stage';
export class CreatePluginDto {
  name: string;
  label: string;
  type: 'builtin' | 'custom';
  description?: string;
  createBy: string;
  steps: PipelineStep[];
}
