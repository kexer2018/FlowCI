import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import { ConfigService } from '@nestjs/config';
import Jenkins from 'jenkins';

@Injectable()
export class JenkinsService extends EventEmitter implements OnModuleInit {
  private readonly logger = new Logger(JenkinsService.name);
  private jenkins: Jenkins;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  onModuleInit() {
    const jenkinsURL = this.configService.get('JENKINS_SERVICE_URL');
    if (!jenkinsURL) {
      throw new InternalServerErrorException('Jenkins URL is not configured');
    }

    this.jenkins = new Jenkins({
      baseUrl: jenkinsURL,
      crumbIssuer: true,
    });
  }

  async getJenkinsInfo() {
    return await this.jenkins.info();
  }

  async getJobLogs(name: string) {
    return await this.jenkins.build.log(name, 2);
  }

  async getBuildInfo(name: string, number: number) {
    return this.jenkins.build.get(name, number);
  }

  async stopBuild(name: string, number: number) {
    return this.jenkins.build.stop(name, number);
  }

  async termBuild(name: string, number: number) {
    return this.jenkins.build.term(name, number);
  }

  async logStream(name: string, number: number) {
    const logger = await this.jenkins.build.logStream(name, number);

    logger.on('data', (text: string) => {
      this.logger.log(`[LOG] ${text}`);
      this.emit('log', text);
    });

    logger.on('error', (err: Error) => {
      this.logger.error('[ERROR]', err);
      this.emit('error', err);
    });

    logger.on('end', () => {
      this.logger.log('[END] Log Stream Ended');
      this.emit('end');
    });

    return logger;
  }

  async jobBuild(name: string) {
    try {
      this.logger.log(`Starting job: ${name}`);
      await this.jenkins.job.build({ name });

      let buildNumber = null;
      while (!buildNumber) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const jobInfo = await this.getJobInfo(name);
        buildNumber = jobInfo.lastBuild?.number;
      }

      this.logStream(name, buildNumber);
    } catch (error) {
      this.logger.error('Job Build Error:', error);
      throw new InternalServerErrorException('Job build failed');
    }
  }

  async getJobConfig(name: string) {
    return this.jenkins.job.config(name);
  }

  async getJobInfo(name: string) {
    return this.jenkins.job.get(name);
  }

  async getJobList(folder?: string) {
    return folder ? this.jenkins.job.list(folder) : this.jenkins.job.list();
  }

  async createJob(name: string, xml: string) {
    return this.jenkins.job.create(name, xml);
  }

  async checkExistsJob(name: string) {
    return this.jenkins.job.exists(name);
  }

  async deleteJob(name: string) {
    return this.jenkins.job.destroy(name);
  }

  async updateEnableJob(name: string, enable: boolean) {
    return enable
      ? this.jenkins.job.enable(name)
      : this.jenkins.job.disable(name);
  }

  async queueList() {
    return this.jenkins.queue.list();
  }

  async getItemInfo(id: number) {
    return this.jenkins.queue.item(id);
  }

  async cancelItem(id: number) {
    return this.jenkins.queue.cancel(id);
  }

  async getViewInfo(name: string) {
    return this.jenkins.view.get(name);
  }

  async getViewList() {
    return this.jenkins.view.list();
  }
}
