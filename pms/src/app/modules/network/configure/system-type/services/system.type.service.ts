import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ISystemType, ISystemTypeSearchParams } from '../models/system-type';

@Injectable({
  providedIn: 'root'
})
export class SystemTypeService {
  constructor(
    private httpService: HttpService
  ) { }

  getItemTypes = () => {
    return this.httpService.get(API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.GET_ITEM_TYPE_LIST);
  };

  getSystemTypes = (requestObject: ISystemTypeSearchParams) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.GET_SYSTEM_TYPE, requestObject);
  };

  addSystemType = (requestObject: ISystemType) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.ADD_SYSTEM_TYPE, requestObject, true);
  };

  getSystemTypeById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.GET_SYSTEM_TYPE_BY_ID}${id}`);
  };

  updateSystemType = (id: number, requestObject: ISystemType) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.GET_SYSTEM_TYPE_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.GET_SYSTEM_TYPE_BY_ID}${id}/${status}`, {}, true);
  };
}
