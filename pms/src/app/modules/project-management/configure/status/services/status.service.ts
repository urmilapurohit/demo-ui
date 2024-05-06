import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IProjectStatusAdd, IProjectStatusSearchParams } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(
    private httpService: HttpService
  ) { }

  getProjectStatus = (requestObject: IProjectStatusSearchParams) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_STATUS.GET_STATUS, requestObject);
  };

  addProjectStatus = (requestObject: IProjectStatusAdd) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_STATUS.STATUS_PREFIX, requestObject, true);
  };
  getProjectStatusById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_STATUS.STATUS_PREFIX}/${id}`, true);
  };

  updateProjectStatus = (id: number, requestObject: IProjectStatusAdd) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_STATUS.STATUS_PREFIX}/${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_STATUS.STATUS_PREFIX}/${id}/${status}`, {});
  };
}
