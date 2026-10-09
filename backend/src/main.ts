import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { fail } from './common/errors.js';
import { ApiExceptionFilter } from './common/api-exception.filter.js';
import { API_PREFIX, setupSwagger } from './swagger.js';
const app = await NestFactory.create(AppModule);
app.setGlobalPrefix(API_PREFIX);
app.useGlobalFilters(new ApiExceptionFilter());
app.enableCors({
  origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
});
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: () =>
      fail(
        400,
        'VALIDATION_ERROR',
        'Invalid request fields. Check required values and supported formats.',
      ),
  }),
);
setupSwagger(app);
await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
