import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { load } from './template/common';

async function init() {
  await load();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await init();
  await app.listen(3000);
}
bootstrap();
