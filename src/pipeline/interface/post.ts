export interface PipelinePost {
  key: 'always' | 'success' | 'unstable' | 'failure' | 'changed' | 'aborted';
  value: string;
}
