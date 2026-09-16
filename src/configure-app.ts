import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('v1', {
    exclude: [
      { path: 'health/live', method: RequestMethod.GET },
      { path: 'health/ready', method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
