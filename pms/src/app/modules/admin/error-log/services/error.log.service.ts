import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IErrorLogDelete, IErrorLogSearchParams } from '../models/error.log';

@Injectable({
  providedIn: 'root'
})

export class ErrorLogService {
  constructor(
    private httpService: HttpService
  ) { }

  getErrorLogs = (requestObject: IErrorLogSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.ERROR_LOG.GET_ERROR_LOG, requestObject);
  };
  getErrorLogById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.ERROR_LOG.GET_ERROR_LOG_BY_ID}${id}`, true);
  };
  deleteErrorLogs = (requestObject:IErrorLogDelete) => {
    return this.httpService.post(API_ROUTES.ADMIN.ERROR_LOG.DELETE_ERROR_LOG_BY_IDS, requestObject, true);
  };
}
