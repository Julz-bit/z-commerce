import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { formatErrors } from '@app/utils/format-error';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = formatErrors(errors);
        return new BadRequestException({ errors: formattedErrors });
      },
    }),
  );

  if (config.get<string>('NODE_ENV') !== 'prod') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Z-Commerce')
      .setDescription('Z-Commerce API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('z-commerce')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(config.get<number>('APP_PORT') ?? 3000);
}

void bootstrap();
