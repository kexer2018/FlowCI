import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Step 类型
export enum StepType {
  SH = 'sh',
  ECHO = 'echo',
  INPUT = 'input',
  RETRY = 'retry',
  TIMEOUT = 'timeout',
  PARALLEL = 'parallel',
}

type timeout = {
  time: string;
  unit: string;
};

// 基础 Step 定义
export class PipelineStep {
  @IsEnum(StepType)
  type: StepType;

  @IsOptional()
  @IsString()
  value?: string; // 例如：sh 的脚本、echo 的信息、input 的提示

  @IsOptional()
  @IsString()
  condition?: string; // 如：when 表达式（可以是脚本、表达式等）

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStep)
  steps?: PipelineStep[]; // retry/timeout/parallel 类型下的嵌套步骤
}

// 阶段定义
export class PipelineStage {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  condition?: string; // 如：when 条件

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStep)
  steps?: PipelineStep[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStage)
  parallel?: PipelineStage[]; // 如果当前 stage 是并行的
}

// agent 定义
export class PipelineAgent {
  @IsNotEmpty()
  type: 'docker' | 'kubernetes' | 'any';

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  label?: string;
}

// 触发器
export class Trigger {
  @IsOptional()
  @IsString()
  cron?: string;

  @IsOptional()
  @IsString()
  pollSCM?: string;

  @IsOptional()
  @IsString()
  upstream?: string;
}

// options选项
export class PipelineOptions {
  @IsOptional()
  @IsString()
  timeout?: timeout;

  @IsOptional()
  @IsString()
  retry?: string;

  @IsOptional()
  @IsString()
  timestamps?: string;

  @IsOptional()
  @IsString()
  skipDefaultCheckout?: string;
}

// post 执行后的钩子脚本
export class PostAction {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  success?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  failure?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  always?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unstable?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changed?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aborted?: string[];
}

// pipeline 主体
export class CreatePipelineDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => PipelineAgent)
  agent: PipelineAgent;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PipelineStage)
  stages: PipelineStage[];

  @IsOptional()
  @IsObject()
  environment?: Record<string, string>;

  @ValidateNested()
  @Type(() => Trigger)
  @IsOptional()
  triggers?: Trigger;

  @ValidateNested()
  @Type(() => PostAction)
  @IsOptional()
  post?: PostAction;

  @ValidateNested()
  @Type(() => PipelineOptions)
  @IsOptional()
  options?: PipelineOptions;
}
