import { PipelineConfig } from '../interface/pipeline';
import { PipelineAgent } from '../interface/agent';
import { PipelinePost } from '../interface/post';
import { PipelineOption } from '../interface/options';
import { PipelineTrigger } from '../interface/trigger';
import { PipelineStage, PipelineStep } from '../interface/stage';

const defaultConfig = {
  agent: {
    type: 'any',
  } as PipelineAgent,
  stages: [],
  post: [
    {
      key: 'always',
      value: 'cleanWs()',
    },
  ] as PipelinePost[],
};

export class PipelineBuilder {
  private config: PipelineConfig = { ...defaultConfig };

  setAgent(agent: PipelineAgent) {
    this.config.agent = agent;
  }

  setEnvironment(env: Record<string, string>) {
    this.config.environment = env;
  }

  addTool(toolName: string, toolValue: string) {
    if (!this.config.tools) this.config.tools = {};
    this.config.tools[toolName] = toolValue;
  }

  addOption(option: PipelineOption) {
    if (!this.config.options) this.config.options = {};
    this.config.options = { ...this.config.options, ...option };
  }

  addTrigger(trigger: PipelineTrigger) {
    if (!this.config.triggers) this.config.triggers = {};
    this.config.triggers = { ...this.config.triggers, ...trigger };
  }

  setPostActions(postActions: PipelinePost) {
    this.config.post.push(postActions);
  }

  addStage(stage: any) {
    if (!this.config.stages) this.config.stages = [];
    this.config.stages.push(stage);
  }

  applyTemplate(json: any) {
    this.config.stages = json.stages;
  }

  private renderAgent(): string {
    if (!this.config.agent) return '';
    const agent = this.config.agent;
    switch (agent.type) {
      case 'any':
        return 'agent any';
      case 'none':
        return 'agent none';
      case 'label':
        return `agent { label '${agent.value}' }`;
      case 'node':
        return `agent { node { label '${agent.label}' } }`;
      case 'docker':
        return `agent { docker { image '${agent.image}' } }`;
      case 'dockerfile':
        return `agent { dockerfile { dir '${agent.dir}' } }`;
      default:
        return '';
    }
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
    const optionRenderers: Record<string, (value: any) => string> = {
      buildDiscarder: (value) => {
        const logRotator = value?.logRotator;
        if (!logRotator) return '';
        const params = [
          logRotator.numToKeep && `numToKeep: ${logRotator.numToKeep}`,
          logRotator.artifactNumToKeep &&
            `artifactNumToKeep: ${logRotator.artifactNumToKeep}`,
          logRotator.daysToKeep && `daysToKeep: ${logRotator.daysToKeep}`,
          logRotator.artifactDaysToKeep &&
            `artifactDaysToKeep: ${logRotator.artifactDaysToKeep}`,
        ]
          .filter(Boolean)
          .join(', ');
        return `buildDiscarder(logRotator(${params}))`;
      },

      disableConcurrentBuilds: (value) =>
        value ? 'disableConcurrentBuilds()' : '',

      skipDefaultCheckout: (value) => (value ? 'skipDefaultCheckout()' : ''),

      skipStagesAfterUnstable: (value) =>
        value ? 'skipStagesAfterUnstable()' : '',

      checkoutToSubdirectory: (value) =>
        value ? `checkoutToSubdirectory('${value}')` : '',

      timeout: (value) => {
        if (!value?.time || !value?.unit) return '';
        return `timeout(time: ${value.time}, unit: '${value.unit}')`;
      },

      retry: (value) => (value ? `retry(${value})` : ''),

      timestamps: (value) => (value ? 'timestamps()' : ''),
    };

    // 遍历所有选项并生成代码
    const lines = Object.entries(this.config.options)
      .map(([key, value]) => {
        const render = optionRenderers[key];
        return render ? render(value) : '';
      })
      .filter((line) => line !== '');

    return lines.length > 0
      ? `options {\n    ${lines.join('\n    ')}\n}\n`
      : '';
  }

  private renderTriggers(): string {
    if (!this.config.triggers) return '';
    const lines: string[] = [];

    if (this.config.triggers.cron) {
      lines.push(`cron('${this.config.triggers.cron}')`);
    }

    if (this.config.triggers.pollSCM) {
      lines.push(`pollSCM('${this.config.triggers.pollSCM}')`);
    }
    if (this.config.triggers.upstream) {
      const {
        upstreamProject,
        targetBranches,
        threshold,
        ignoreUpstreamChanges,
        allowDependencies,
      } = this.config.triggers.upstream;

      // 构造参数列表
      const params = [
        `upstreamProjects: '${upstreamProject}'`, // 必填参数
        targetBranches
          ? `targetBranches: [${targetBranches.map((b) => `'${b}'`).join(', ')}]`
          : null,
        threshold
          ? `threshold: hudson.model.Result.${threshold.toUpperCase()}`
          : null,
        ignoreUpstreamChanges !== undefined
          ? `ignoreUpstreamChanges: ${ignoreUpstreamChanges}`
          : null,
        allowDependencies !== undefined
          ? `allowDependencies: ${allowDependencies}`
          : null,
      ].filter(Boolean); // 过滤空值

      lines.push(`upstream(${params.join(', ')})`);
    }

    if (lines.length === 0) return '';

    return `triggers {
      ${lines.join('\n    ')}
    }\n`;
  }

  private renderPost(): string {
    if (!this.config.post || this.config.post.length === 0) return '';

    const postBlocks = this.config.post.map((block) => {
      const commands = block.value
        .split(/[;\n]/)
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd !== '');

      const commandLines = commands
        .map((cmd) => (cmd.startsWith('sh ') ? cmd : `${cmd}`))
        .join('\n        ');
      return `${block.key} {\n        ${commandLines}\n      }`;
    });
    return `post {\n    ${postBlocks.join('\n    ')}\n  }`;
  }

  private renderStages(): string {
    if (this.config.stages.length === 0) {
      throw new Error('No stages defined in the pipeline.');
    }
    return `  stages {
  ${this.config.stages.map(this.renderStageBlock).join('\n')}
    }`;
  }

  private renderStageBlock(stage: PipelineStage): string {
    console.log(stage);
    const blocks = stage.stepGroups.map((group, index) => {
      if (group.steps.length === 1) {
        return this.renderSingleStep(stage.label, group.steps[0]);
      } else {
        return `      stage('${stage.label} - group${index + 1}') {
          parallel {
  ${group.steps.map((step) => this.renderParallelStep(step)).join('\n')}
          }
        }`;
      }
    });
    return blocks.join('\n');
  }

  private renderSingleStep(stageName: string, step: PipelineStep): string {
    const rendered = this.interpolateScript(step);
    return `    stage('${stageName}') {
        steps {
          script {
            ${rendered}
          }
        }
      }`;
  }

  private renderParallelStep(step: PipelineStep): string {
    const rendered = this.interpolateScript(step);
    return `          stage('${step.name}') {
              steps {
                script {
                  ${rendered}
                }
              }
            }`;
  }

  private interpolateScript(step: PipelineStep): string {
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
        ${this.renderAgent()}\n
        ${this.renderEnvironment()}\n
        ${this.renderTools()}\n
        ${this.renderOptions()}\n
        ${this.renderTriggers()}\n
        ${this.renderStages()}\n
        ${this.renderPost()}
      }
    `;
  }
}
