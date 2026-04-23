import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: string[];
  path: string;
  timestamp: string;
}

/**
 * Global HTTP exception filter.
 *
 * Normalises all thrown HttpExceptions — including class-validator errors from
 * ValidationPipe — into a consistent JSON shape:
 *
 * ```json
 * {
 *   "statusCode": 400,
 *   "message": "Validation failed",
 *   "errors": ["email must be an email", "password must be longer than 6 chars"],
 *   "path": "/api/v1/auth/register",
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let errors: string[];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errors = [];
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;

        // ValidationPipe emits { message: string[], error: string }
        if (Array.isArray(resp['message'])) {
          message = 'Validation failed';
          errors = resp['message'] as string[];
        } else {
          message = (resp['message'] as string) ?? exception.message;
          errors = [];
        }
      } else {
        message = exception.message;
        errors = [];
      }
    } else {
      // Unhandled / non-HTTP errors — log and return generic 500
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      errors = [];
      this.logger.error('Unhandled exception', exception as Error);
    }

    const body: ErrorResponse = {
      statusCode,
      message,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
