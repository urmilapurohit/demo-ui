import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ISystemStatus, ISystemStatusSearchParams } from '../models/system.status';

@Injectable({
  providedIn: 'root'
})
export class SystemStatusService {
  constructor(
    private httpService: HttpService
  ) { }

  getSystemStatus = (requestObject: ISystemStatusSearchParams) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.GET_SYSTEM_STATUS, requestObject);
  };

  addSystemStatus = (requestObject: ISystemStatus) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.ADD_SYSTEM_STATUS, requestObject, true);
  };

  getSystemStatusById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.GET_SYSTEM_STATUS_BY_ID}${id}`);
  };

  updateSystemStatus = (id: number, requestObject: ISystemStatus) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.GET_SYSTEM_STATUS_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.GET_SYSTEM_STATUS_BY_ID}${id}/${status}`, {}, true);
  };
}
