import {
  PipelineConfig,
  PostAction,
  Agent,
  Option,
  Trigger,
} from '../../template/interface/pipeline';

import { PipelineStage, PipelineStep } from '../../template/interface/stage';

export class PipelineBuilder {
  private config: PipelineConfig = {
    agent: { type: 'any' },
    stages: [],
    post: [],
  };

  setAgent(agent: Agent) {
    this.config.agent = agent;
  }

  setEnvironment(env: Record<string, string>) {
    this.config.environment = env;
  }

  setTool(toolName: string, toolValue: string) {
    if (!this.config.tools) this.config.tools = {};
    this.config.tools[toolName] = toolValue;
  }

  addOptions(options: Option[]) {
    this.config.options = [...(this.config.options || []), ...options];
  }

  addTriggers(triggers: Trigger[]) {
    this.config.triggers = [...(this.config.triggers || []), ...triggers];
  }

  setPostActions(postActions: PostAction[]) {
    this.config.post = [...this.config.post, ...postActions];
  }

  addStage(stage: any) {
    if (!this.config.stages) this.config.stages = [];
    this.config.stages.push(stage);
  }

  applyTemplate(json: any) {
    this.config.stages = json.stages;
  }

  private renderAgent(): string {
    const { agent } = this.config;
    if (!agent) return '';
    switch (agent.type) {
      case 'any':
        return 'agent any';
      case 'none':
        return 'agent none';
      case 'label':
        return `agent { label '${agent.options?.label || ''}' }`;
      case 'node':
        return `agent { node { label '${agent.options?.label || ''}' } }`;
      case 'docker':
      case 'dockerfile':
        return this.renderDockerAgent(agent.options, agent.type);
      default:
        return '';
    }
  }
  private renderDockerAgent(
    options: Agent['options'] = {},
    type: string,
  ): string {
    const entries = Object.entries({ ...options?.custom, ...options });
    const lines = entries.map(([key, value]) => `        ${key} '${value}'`);
    return `agent {\n    ${type} {\n${lines.join('\n')}\n    }\n}`;
  }

  private renderTriggers(): string {
    const { triggers } = this.config;
    if (!triggers || triggers.length === 0) return '';

    const lines = triggers
      .map((trigger) => this.renderSingleTrigger(trigger))
      .filter(Boolean);

    if (lines.length === 0) return '';

    return `triggers {
      ${lines.join('\n    ')}
    }\n`;
  }

  private renderSingleTrigger(trigger: Trigger): string {
    switch (trigger.type) {
      case 'cron':
        return `cron('${trigger.cron}')`;

      case 'pollSCM':
        return `pollSCM('${trigger.interval}')`;

      case 'upstream':
        const params = [
          `upstreamProjects: '${trigger.upstreamProject}'`,
          trigger.targetBranches?.length
            ? `targetBranches: [${trigger.targetBranches.map((b: string) => `'${b}'`).join(', ')}]`
            : null,
          trigger.threshold
            ? `threshold: hudson.model.Result.${trigger.threshold.toUpperCase()}`
            : null,
          trigger.ignoreUpstreamChanges !== undefined
            ? `ignoreUpstreamChanges: ${trigger.ignoreUpstreamChanges}`
            : null,
          trigger.allowDependencies !== undefined
            ? `allowDependencies: ${trigger.allowDependencies}`
            : null,
        ].filter(Boolean);

        return `upstream(${params.join(', ')})`;

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

  private renderPost(): string {
    if (!this.config.post || this.config.post.length === 0) return '';

    const postBlocks = this.config.post.map((block) => {
      const commands = block.script
        .split(/[;\n]/)
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd !== '');

      const commandLines = commands
        .map((cmd) => (cmd.startsWith('sh ') ? cmd : `${cmd}`))
        .join('\n        ');
      return `${block.condition} {\n        ${commandLines}\n      }`;
    });
    return `post {\n    ${postBlocks.join('\n    ')}\n  }`;
  }

  private renderStages(): string {
    if (this.config.stages.length === 0) {
      throw new Error('No stages defined in the pipeline.');
    }
    return `  stages {
    ${this.config.stages.map((stage) => this.renderStageBlock(stage)).join('\n')}
      }`;
  }

  private renderStageBlock(stage: PipelineStage): string {
    const label = stage.label ?? stage.name; // 优先使用 label
    const blocks = stage.stepGroups.map((group, index) => {
      if (group.steps.length === 1) {
        return this.renderSingleStep(label, group.steps[0]);
      } else {
        return `      stage('${label} - group${index + 1}') {
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
    const sections = [
      this.renderAgent(),
      this.renderEnvironment(),
      this.renderTools(),
      this.renderOptions(),
      this.renderTriggers(),
      this.renderStages(),
      this.renderPost(),
    ].filter(Boolean);

    return `pipeline {\n${sections.join('\n\n')}\n}`;
  }

  toXml(script: string, type: string = 'singal') {
    //转成xml给Jenkins服务器
    let xml: string;
    if (type === 'singal') {
      xml = `<flow-definition plugin="workflow-job">
                    <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps">
                      <script><![CDATA[${script}]]></script>
                      <sandbox>true</sandbox>
                    </definition>
                    <disabled>false</disabled>
                  </flow-definition>
      `;
    }
    return xml;
  }
}
