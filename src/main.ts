import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log(`Starting, PORT:${PORT}`);

  await app.listen(PORT);
}
bootstrap();
