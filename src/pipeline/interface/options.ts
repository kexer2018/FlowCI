export interface PipelineOption {
  buildDiscarder?: {
    logRotator?: {
      numToKeep?: number;
      artifactNumToKeep?: number;
      daysToKeep?: number;
      artifactDaysToKeep?: number;
    };
  };
  disableConcurrentBuilds?: boolean;
  skipDefaultCheckout?: boolean;
  skipStagesAfterUnstable?: boolean;
  checkoutToSubdirectory?: string;
  timeout?: {
    time: string;
    unit: string;
  };
  retry?: number;
  timestamps?: boolean;
}
