import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IStatus, IStatusSearchParams } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(private httpService: HttpService) { }

  getStatuses = (requestObject: IStatusSearchParams) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.STATUS.GET_STATUS, requestObject);
  };

  getStatusById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.CONFIGURATION.STATUS.GET_STATUS_BY_ID}${id}`);
  };

  addStatus = (requestObject: IStatus) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.STATUS.ADD_STATUS, requestObject, true);
  };

  updateStatus = (id: number, requestObject: IStatus) => {
    return this.httpService.put(`${API_ROUTES.PRE_SALES.CONFIGURATION.STATUS.GET_STATUS_BY_ID}${id}`, requestObject, true);
  };

  deleteStatus = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.PRE_SALES.CONFIGURATION.STATUS.GET_STATUS_BY_ID}${id}`, true);
  };
}
