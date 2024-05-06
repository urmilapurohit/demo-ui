import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { GlobalService } from 'workspace-library';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { GLOBAL_CONSTANTS } from '../constants/constant';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private globalService: GlobalService, private authService: AuthService, private router: Router) {
    }
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError((err) => {
            if (err.error instanceof Blob && err.error.type === 'application/json') {
                const reader: FileReader = new FileReader();
                let parsedError: any = {};
                let error = "";
                reader.onload = () => {
                    parsedError = JSON.parse(reader.result as string);
                    error = parsedError?.errorMessages ? (parsedError?.errorMessages) : GLOBAL_CONSTANTS.UNKNOWN_ERROR;
                    this.globalService.openSnackBar(error, 'error-message');
                };
                reader.readAsText(err?.error);
                return throwError(() => error);
            } else {
                const errorMessage = (err?.error?.errorMessages && err?.error?.errorMessages) || GLOBAL_CONSTANTS.UNKNOWN_ERROR;
                if (err.status === 503) {
                    window.location.reload();
                }
                else if (err.status === 401 && (!request.url.includes('/login') && !request.url.includes('/refresh-token'))) {
                    return this.handleTokenRefresh(request, next);
                }
                else if (!request.url.includes('/validate-token')) {
                    this.globalService.openSnackBar(errorMessage, 'error-message');
                }
                const error = err.error ? (errorMessage || err.statusText) : GLOBAL_CONSTANTS.UNKNOWN_ERROR;
                return throwError(() => error);
            }
        }));
    }

    private handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.refreshToken().pipe(
            switchMap(() => {
                return next.handle(request);
            }),
            catchError((error) => {
                window.location.href = `${ENVIRONMENT.ACCOUNT_LOGIN_CLIENT_URL}?returnUrl=${this.router.url && this.router.url.length > 0 && this.router.url[0] === '/' ? this.router.url.substring(1) : ''}`;
                return throwError(error);
            })
        );
    }
}
