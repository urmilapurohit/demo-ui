import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from 'workspace-library';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private globalService: GlobalService, private router: Router) {
    }
    // eslint-disable-next-line class-methods-use-this
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError((err) => {
            if (err.status === 503) {
                window.location.reload();
            }
            const error = err.error ? (err.error.errorMessages[0] || err.statusText) : 'An unknown error occurred..!';
            return throwError(() => error);
        }));
    }
}
