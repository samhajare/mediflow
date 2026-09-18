import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getRequestContext } from '../context/request-context';
import { AppError, ErrorCode } from '../errors/app-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const requestId =
      getRequestContext()?.requestId ??
      request.header('x-request-id') ??
      'unknown';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: {
      code: string;
      message: string;
      requestId: string;
      details?: unknown;
    } = {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred.',
      requestId,
    };
    if (exception instanceof AppError) {
      status = exception.statusCode;
      body = {
        code: exception.code,
        message: exception.message,
        requestId,
        ...(exception.details === undefined
          ? {}
          : { details: exception.details }),
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const codeByStatus: Record<number, string> = {
        400: ErrorCode.VALIDATION_ERROR,
        401: ErrorCode.UNAUTHENTICATED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.NOT_FOUND,
        409: ErrorCode.CONFLICT,
      };
      const payload = exception.getResponse();
      const messages =
        typeof payload === 'object' && payload !== null && 'message' in payload
          ? payload.message
          : undefined;
      body = {
        code: codeByStatus[status] ?? ErrorCode.INTERNAL_ERROR,
        message:
          status === 400
            ? 'Request validation failed.'
            : status < 500
              ? exception.message
              : body.message,
        requestId,
        ...(status === 400 && Array.isArray(messages)
          ? { details: messages }
          : {}),
      };
    } else {
      this.logger.error({
        requestId,
        method: request.method,
        path: request.url,
        error: exception instanceof Error ? exception.message : 'unknown',
      });
    }
    response.status(status).json(body);
  }
}
