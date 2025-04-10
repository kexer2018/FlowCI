export interface StageParam {
  key: string;
  value: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  type: string;
  stepGroups: StepGroups[];
}

export interface StepGroups {
  steps: PipelineStep[];
}

export interface PipelineStep {
  id: string;
  name: string;
  type: string;
  params?: StageParam[];
  condition?: string;
  script?: string;
}
