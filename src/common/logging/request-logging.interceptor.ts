import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { getRequestContext } from '../context/request-context';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const started = Date.now();
    const logCompletion = (): void =>
      this.logger.log(
        JSON.stringify({
          method: request.method,
          path: request.path,
          statusCode: response.statusCode,
          durationMs: Date.now() - started,
          ...getRequestContext(),
        }),
      );
    return next
      .handle()
      .pipe(tap({ next: logCompletion, error: logCompletion }));
  }
}
