import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { load } from './common';

async function init() {
  // 加载常用模板到内存
  await load();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init();
  await app.listen(3000);
}
bootstrap();
