import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiHost: string = ENVIRONMENT.HOST_ENDPOINT;
  private authHost: string = ENVIRONMENT.AUTH_ENDPOINT;
  constructor(
    private http: HttpClient
  ) { }

  // GET METHOD
  get = (
    apiEndPoint: string,
    isShowLoader?: boolean,
    params?: HttpParams,
    responseType?: any,
    isAuthEndPoint?: boolean
  ): Observable<any> => {
    const host = isAuthEndPoint ? this.authHost : this.apiHost;
    if (isShowLoader) {
      if (params) {
        params = params.append('show-loader', 'true');
      }
      else {
        params = new HttpParams().set('show-loader', 'true');
      }
    }
    return this.http.get<any>(
      host + apiEndPoint,
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
    isShowLoader?: boolean,
    params?: HttpParams,
    responseType?: any,
    isAuthEndPoint?: boolean
  ): Observable<any> => {
    const host = isAuthEndPoint ? this.authHost : this.apiHost;
    if (isShowLoader) {
      if (params) {
        params = params.append('show-loader', 'true');
      }
      else {
        params = new HttpParams().set('show-loader', 'true');
      }
    }
    return this.http.post<any>(
      host + apiEndPoint,
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
    isShowLoader?: boolean,
    params?: HttpParams
  ): Observable<any> => {
    if (isShowLoader) {
      if (params) {
        params = params.append('show-loader', 'true');
      }
      else {
        params = new HttpParams().set('show-loader', 'true');
      }
    }
    return this.http.put<any>(
      this.apiHost + apiEndPoint,
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
  delete = (apiEndPoint: string, isShowLoader?: boolean, params?: HttpParams): Observable<any> => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (isShowLoader) {
      if (params) {
        params = params.append('show-loader', 'true');
      }
      else {
        params = new HttpParams().set('show-loader', 'true');
      }
    }
    return this.http.delete<any>(
      this.apiHost + apiEndPoint,
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
