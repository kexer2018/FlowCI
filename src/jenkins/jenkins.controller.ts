import { Controller } from '@nestjs/common';
import { JenkinsService } from './jenkins.service';

@Controller('jenkins')
export class JenkinsController {
  constructor(private readonly jenkinsService: JenkinsService) {}
}
