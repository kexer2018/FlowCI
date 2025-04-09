export interface Param {
  key: string;
  value: string;
}

export interface Step {
  name: string;
  params?: Param[];
  script: string;
}

export interface StepGroup {
  steps: Step[];
}

export interface StageBlock {
  name: string;
  type?: string;
  stepGroup: StepGroup[];
}

export interface PipelineConfig {
  agent?: string;
  environment?: Record<string, string>;
  tools?: Record<string, string>;
  options?: string[];
  triggers?: string[];
  post?: string;
  stages: StageBlock[];
}

export class PipelineBuilder {
  private config: PipelineConfig = { stages: [] };

  setAgent(agent: string) {
    this.config.agent = agent;
  }

  setEnvironment(env: Record<string, string>) {
    this.config.environment = env;
  }

  addTool(toolName: string, toolValue: string) {
    if (!this.config.tools) this.config.tools = {};
    this.config.tools[toolName] = toolValue;
  }

  addOption(option: string) {
    if (!this.config.options) this.config.options = [];
    this.config.options.push(option);
  }

  addTrigger(trigger: string) {
    if (!this.config.triggers) this.config.triggers = [];
    this.config.triggers.push(trigger);
  }

  setPostActions(script: string) {
    this.config.post = script;
  }

  addStage(stage: StageBlock) {
    this.config.stages.push(stage);
  }

  private renderEnvironment(): string {
    const env = this.config.environment;
    if (!env) return '';
    const lines = Object.entries(env).map(([k, v]) => `      ${k} = '${v}'`);
    return `  environment {
  ${lines.join('\n')}
    }\n`;
  }

  private renderTools(): string {
    const tools = this.config.tools;
    if (!tools) return '';
    const lines = Object.entries(tools).map(([k, v]) => `      ${k} '${v}'`);
    return `  tools {
  ${lines.join('\n')}
    }\n`;
  }

  private renderOptions(): string {
    if (!this.config.options) return '';
    const lines = this.config.options.map((opt) => `    ${opt}`);
    return `  options {
  ${lines.join('\n')}
    }\n`;
  }

  private renderTriggers(): string {
    if (!this.config.triggers) return '';
    const lines = this.config.triggers.map((t) => `    ${t}`);
    return `  triggers {
  ${lines.join('\n')}
    }\n`;
  }

  private renderPost(): string {
    if (!this.config.post) return '';
    return `  post {
      always {
        ${this.config.post}
      }
    }\n`;
  }

  private renderStages(): string {
    return `  stages {
  ${this.config.stages.map(this.renderStageBlock).join('\n')}
    }`;
  }

  private renderStageBlock(stage: StageBlock): string {
    const blocks = stage.stepGroup.map((group, index) => {
      if (group.steps.length === 1) {
        return this.renderSingleStep(stage.name, group.steps[0]);
      } else {
        return `      stage('${stage.name} - group${index + 1}') {
          parallel {
  ${group.steps.map((step) => this.renderParallelStep(step)).join('\n')}
          }
        }`;
      }
    });
    return blocks.join('\n');
  }

  private renderSingleStep(stageName: string, step: Step): string {
    const rendered = this.interpolateScript(step);
    return `    stage('${stageName}') {
        steps {
          script {
            ${rendered}
          }
        }
      }`;
  }

  private renderParallelStep(step: Step): string {
    const rendered = this.interpolateScript(step);
    return `          stage('${step.name}') {
              steps {
                script {
                  ${rendered}
                }
              }
            }`;
  }

  private interpolateScript(step: Step): string {
    let script = step.script;
    if (step.params) {
      for (const param of step.params) {
        const re = new RegExp(`{{\s*${param.key}\s*}}`, 'g');
        script = script.replace(re, param.value);
      }
    }
    return script
      .split('\n')
      .map((line) => '            ' + line)
      .join('\n');
  }

  generate(): string {
    return `pipeline {
    agent { label '${this.config.agent ?? 'any'}' }
  ${this.renderEnvironment()}${this.renderTools()}${this.renderOptions()}${this.renderTriggers()}${this.renderStages()}\n${this.renderPost()}}
  `;
  }
}
