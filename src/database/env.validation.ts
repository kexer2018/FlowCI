import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  validateSync,
  IsEnum,
} from 'class-validator';

enum NodeEnv {
  DEVELOPMENT = 'dev',
  TEST = 'test',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv, {
    message: `NODE_ENV 必须是以下值之一: ${Object.values(NodeEnv).join(', ')}`,
  })
  NODE_ENV: NodeEnv;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsBoolean()
  DB_SYNC: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
