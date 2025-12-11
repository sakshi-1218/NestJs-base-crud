
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    console.log(` [${method}] ${url} - Incoming request...`);

    return next.handle().pipe(
      tap(() =>
        console.log(` [${method}] ${url} - Completed in ${Date.now() - start}ms`),
      ),
    );
  }
}
