import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../common/services/http.service';
import { API_ROUTES } from '../../../../../common/constants/apiroutes';
import { IManageSearchParams, IManageUpdate } from '../models/manage';

@Injectable({
  providedIn: 'root'
})

export class ManageService {
  constructor(
    private httpService: HttpService
  ) { }

  getManage = (requestObject: IManageSearchParams) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.REGULARIZE.MANAGE.GET_MANAGE, requestObject);
  };

  getManageById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_PREFIX}${id}`);
  };

  updateManage = (id: number, requestObject: IManageUpdate) => {
    return this.httpService.put(`${API_ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_PREFIX}${id}`, requestObject, true);
  };

  getHistories = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_HISTORIES}${id}`);
  };

  getManageStatus = () => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_STATUS}${false}/${true}`);
  };

  getSelfStatus = () => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_STATUS}${false}/${false}`);
  };
}
