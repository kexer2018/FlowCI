import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Jenkins from 'jenkins';

export interface JenkinsConfig {
  baseUrl: string;
  user: string;
  apiToken: string;
}

@Injectable()
export class JenkinsService {
  private readonly jenkinsClient: Jenkins;
  private readonly logger = new Logger(JenkinsService.name);

  constructor(private configService: ConfigService) {
    const jenkinsConfig = this.getJenkinsConfig();
    this.validateConfig(jenkinsConfig);

    this.jenkinsClient = new Jenkins({
      baseUrl: jenkinsConfig.baseUrl,
      crumbIssuer: true,
      headers: {
        Authorization: this.createBasicAuthHeader(
          jenkinsConfig.user,
          jenkinsConfig.apiToken,
        ),
      },
    });
  }

  // 基础配置方法
  private getJenkinsConfig(): JenkinsConfig {
    return {
      baseUrl: this.configService.get<string>('JENKINS_URL'),
      user: this.configService.get<string>('JENKINS_USER'),
      apiToken: this.configService.get<string>('JENKINS_API_TOKEN'),
    };
  }

  private validateConfig(config: JenkinsConfig): void {
    if (!config.baseUrl || !config.user || !config.apiToken) {
      throw new Error('Missing Jenkins configuration parameters');
    }
  }

  private createBasicAuthHeader(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }

  // 常用方法封装
  async buildJob(
    jobName: string,
    parameters?: Record<string, any>,
  ): Promise<number> {
    try {
      const queueId = await this.jenkinsClient.job.build({
        name: jobName,
        parameters,
      });
      return this.waitForBuildStart(queueId);
    } catch (error) {
      this.logger.error(`Failed to build job ${jobName}: ${error.message}`);
      throw error;
    }
  }

  async getJobInfo(jobName: string): Promise<any> {
    try {
      return await this.jenkinsClient.job.get(jobName);
    } catch (error) {
      this.logger.error(`Failed to get job info ${jobName}: ${error.message}`);
      throw error;
    }
  }

  async getBuildLogs(jobName: string, buildNumber: number): Promise<string> {
    try {
      return await this.jenkinsClient.build.log(jobName, buildNumber);
    } catch (error) {
      this.logger.error(
        `Failed to get logs for ${jobName}#${buildNumber}: ${error.message}`,
      );
      throw error;
    }
  }

  // 高级功能封装
  async triggerParameterizedBuild(
    jobName: string,
    parameters: Record<string, any>,
  ): Promise<number> {
    return this.buildJob(jobName, parameters);
  }

  async getBuildStatus(jobName: string, buildNumber: number): Promise<any> {
    try {
      return await this.jenkinsClient.build.get(jobName, buildNumber);
    } catch (error) {
      this.logger.error(
        `Failed to get build status ${jobName}#${buildNumber}: ${error.message}`,
      );
      throw error;
    }
  }

  // 私有帮助方法
  private async waitForBuildStart(queueId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const queueItem = await this.jenkinsClient.queue.item(queueId);
          if (queueItem.executable?.number) {
            clearInterval(interval);
            resolve(queueItem.executable.number);
          }

          if (queueItem.cancelled) {
            clearInterval(interval);
            reject(new Error('Build cancelled in queue'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000);
    });
  }

  // 其他方法可根据需要继续扩展...
}
