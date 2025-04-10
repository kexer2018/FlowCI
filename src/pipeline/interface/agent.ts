export type PipelineAgent =
  | AnyAgent
  | NoneAgent
  | LabelAgent
  | NodeAgent
  | DockerAgent
  | DockerfileAgent;

interface AgentCommonOptions {
  label?: string;
  customWorkspace?: string;
  reuseNode?: boolean;
}

interface AnyAgent {
  type: 'any';
}

interface NoneAgent {
  type: 'none';
}

interface LabelAgent extends AgentCommonOptions {
  type: 'label';
  value: string;
}

interface NodeAgent extends AgentCommonOptions {
  type: 'node';
  label: string;
}

interface DockerAgent extends AgentCommonOptions {
  type: 'docker';
  image: string;
  args?: string;
  alwaysPull?: boolean;
}

interface DockerfileAgent extends AgentCommonOptions {
  type: 'dockerfile';
  filename?: string;
  dir?: string;
  additionalBuildArgs?: string;
}
