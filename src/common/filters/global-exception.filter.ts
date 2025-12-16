import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = isHttp ? exception.getResponse() : null;

    const message =
      typeof response === 'string'
        ? response
        : ((response as any)?.message ?? 'Internal server error');

    const errorName = isHttp ? exception.name : 'InternalServerError';

    this.logger.error(
      `[${req.method}] ${req.url} -> ${status} (${errorName})`,
      (exception as any)?.stack,
    );

    res.status(status).json({
      statusCode: status,
      message,
      error: errorName,
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}
