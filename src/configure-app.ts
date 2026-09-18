import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RequestContextMiddleware } from './common/context/request-context.middleware';
import { RequestLoggingInterceptor } from './common/logging/request-logging.interceptor';
import { AppError, ErrorCode } from './common/errors/app-error';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('v1', {
    exclude: [
      { path: 'health/live', method: RequestMethod.GET },
      { path: 'health/ready', method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new AppError(
          ErrorCode.VALIDATION_ERROR,
          400,
          'Request validation failed.',
          errors.map((error) => ({
            field: error.property,
            messages: Object.values(error.constraints ?? {}),
          })),
        ),
    }),
  );
  app.use(new RequestContextMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'SAMEORIGIN');
    response.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? ['http://localhost:3000'],
  });
}
