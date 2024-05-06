import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private authHost: string = ENVIRONMENT.AUTH_ENDPOINT;
    constructor(
        private http: HttpClient
    ) { }

    // GET METHOD
    get = (
        apiEndPoint: string,
        params?: HttpParams,
        responseType?: any
    ): Observable<any> => {
        return this.http.get<any>(
            this.authHost + apiEndPoint,
            {
                observe: "response",
                params,
                withCredentials: true,
                responseType
            }
        ).pipe(
            map((response: any) => {
                if (response.status === 200) {
                    return response.body;
                }
                if (response.status === 204) {
                    return null;
                }
                return response;
            }),
            catchError(this.handleError)
        );
    };

    // POST METHOD
    post = (
        apiEndPoint: string,
        model: any,
        params?: HttpParams,
        responseType?: any,
    ): Observable<any> => {
        return this.http.post<any>(
            this.authHost + apiEndPoint,
            model,
            {
                observe: "response",
                params,
                withCredentials: true,
                responseType
            }
        ).pipe(
            map((response) => {
                if (response.status === 200) {
                    return response.body;
                }
                if (response.status === 204) {
                    return null;
                }
                return response;
            }),
            catchError(this.handleError)
        );
    };

    // PUT METHOD
    put = (
        apiEndPoint: string,
        model: any,
        params?: HttpParams
    ): Observable<any> => {
        return this.http.put<any>(
            this.authHost + apiEndPoint,
            model,
            {
                observe: "response",
                params,
                withCredentials: true
            }
        ).pipe(
            map((response) => {
                if (response.status === 200) {
                    return response.body;
                }
                if (response.status === 204) {
                    return null;
                }
                return response;
            }),
            catchError(this.handleError)
        );
    };

    // DELETE METHOD
    delete = (apiEndPoint: string, params?: HttpParams): Observable<any> => {
        const headers = {
            "Content-Type": "application/json",
        };
        return this.http.delete<any>(
            this.authHost + apiEndPoint,
            {
                headers,
                observe: "response",
                params,
                withCredentials: true
            }
        ).pipe(
            map((response) => {
                if (response.status === 200) {
                    return response.body;
                }
                if (response.status === 204) {
                    return null;
                }
                return response;
            }),
            catchError(this.handleError)
        );
    };

    private handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}
