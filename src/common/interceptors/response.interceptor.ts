import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable, map } from 'rxjs';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<any> {
      const res = context.switchToHttp().getResponse();
  
      return next.handle().pipe(
        map((data) => ({
          success: true,
          statusCode: res.statusCode,
          data,
          timestamp: new Date().toISOString(),
        })),
      );
    }
  }
  