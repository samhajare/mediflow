import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContextStorage } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = request.header('x-request-id')?.trim() || randomUUID();
    const correlationId =
      request.header('x-correlation-id')?.trim() || randomUUID();
    const context = { requestId, correlationId };
    response.setHeader('X-Request-Id', requestId);
    response.setHeader('X-Correlation-Id', correlationId);
    requestContextStorage.run(context, next);
  }
}
