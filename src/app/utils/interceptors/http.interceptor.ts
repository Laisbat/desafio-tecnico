import {
  HttpInterceptor as AngularHttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptor implements AngularHttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const newHeadrers = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return next.handle(newHeadrers);
  }
}
