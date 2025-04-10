import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function init() {
  // 加载常用模板到内存
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init();
  await app.listen(3000);
}
bootstrap();
