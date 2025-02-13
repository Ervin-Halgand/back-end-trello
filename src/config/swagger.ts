import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface swaggerConfig {
  app: INestApplication<any>;
  title: string;
  description?: string;
  endpoint?: string;
  version?: string;
}

const initSwagger = ({
  app,
  title,
  description,
  endpoint,
  version,
}: swaggerConfig) => {
  const SWAGGER_ROUTE = endpoint ?? 'api';

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description ?? '')
    .setVersion(version ?? '')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_ROUTE, app, documentFactory);
};

export default initSwagger;
