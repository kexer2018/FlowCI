export interface PipelineTrigger {
  cron?: string;
  pollSCM?: string;
  upstream?: {
    upstreamProject: string;
    targetBranches?: string[];
    threshold?: string;
    ignoreUpstreamChanges?: boolean;
    allowDependencies?: boolean;
  };
}
