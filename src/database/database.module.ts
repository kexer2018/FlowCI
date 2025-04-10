import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import * as crypto from 'crypto';
(global as any).crypto = crypto;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFiles(),
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log('config', config.get('DB_PORT'));
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') || 'localhost',
          port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
          username: config.get<string>('DB_USERNAME') || 'root',
          password: config.get<string>('DB_PASSWORD') || 'root',
          database: config.get<string>('DB_NAME') || 'flow-dev',
          synchronize: config.get<boolean>('DB_SYNC') ?? false,
          logging: config.get('NODE_ENV') === 'dev',
          autoLoadEntities: true,
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        };
      },
    }),
  ],
})
export class DatabaseModule {}

function getEnvFiles(): string[] {
  const env = process.env.NODE_ENV || 'dev';
  const basePath = process.cwd();
  const fileNames = [`.env.${env}`];

  return fileNames.map((file) => resolve(basePath, file));
}

console.log('Loaded env files:', getEnvFiles());
