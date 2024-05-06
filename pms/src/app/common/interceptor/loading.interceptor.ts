import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoaderService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const showLoader = request.params.get('show-loader');
    if (showLoader === 'true') {
      request = request.clone({ params: request.params.delete('show-loader', 'true') });
      this.loadingService.setLoading(true);
    }
    return next.handle(request).pipe(
      finalize(() => {
          this.loadingService.setLoading(false);
      })
    );
  }
}
