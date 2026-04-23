import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Global response transform interceptor.
 *
 * Wraps every successful response in a consistent envelope:
 *
 * ```json
 * {
 *   "data": { ... },
 *   "statusCode": 200,
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "path": "/api/v1/applications"
 * }
 * ```
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TransformedResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map(
        (data): TransformedResponse<T> => ({
          data,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        }),
      ),
    );
  }
}
