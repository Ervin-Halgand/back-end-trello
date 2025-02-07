import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import initSwagger from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initSwagger({
    app,
    title: 'Trello',
    description: 'API documentation for a minified Trello',
    version: '1.0',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
