import { PipelineStage } from './stage';

export type AgentType =
  | 'any'
  | 'none'
  | 'docker'
  | 'label'
  | 'dockerfile'
  | 'node';

export interface Agent {
  type: AgentType;
  options?: {
    dockerImage?: string;
    label?: string;
    custom?: Record<string, any>;
  };
}

export interface Option {
  name: 'timeout' | 'retry' | 'skipDefaultCheckout' | string;
  config?: {
    time?: number;
    unit?: 'SECONDS' | 'MINUTES' | 'HOURS';
    retries?: number;
    [key: string]: any;
  };
}

export type PostCondition =
  | 'always'
  | 'success'
  | 'unstable'
  | 'failure'
  | 'changed'
  | 'aborted';

export interface PostAction {
  condition: PostCondition;
  script: string;
}

export interface CronTrigger {
  type: 'cron';
  cron: string;
}

export interface PollSCMTrigger {
  type: 'pollSCM';
  interval: string;
}

export interface UpstreamTrigger {
  type: 'upstream';
  upstreamProject: string;
  targetBranches?: string[];
  threshold?: string;
  ignoreUpstreamChanges?: boolean;
  allowDependencies?: boolean;
}

export type Trigger = CronTrigger | PollSCMTrigger | UpstreamTrigger;

export interface Environment {
  [key: string]: string;
}

export interface Tools {
  node?: string;
  maven?: string;
  jdk?: string;
  [key: string]: string | undefined;
}

export interface PipelineConfig {
  agent: Agent;
  environment?: Environment;
  tools?: Tools;
  options?: Option[];
  triggers?: Trigger[];
  stages: PipelineStage[];
  post?: PostAction[];
}
