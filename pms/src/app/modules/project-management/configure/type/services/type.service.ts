import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IProjectTypeAdd, IProjectTypeSearchParams } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  constructor(
    private httpService: HttpService
  ) { }

  getProjectTypes = (requestObject: IProjectTypeSearchParams) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_TYPES.GET_TYPES, requestObject);
  };

  addProjectType = (requestObject: IProjectTypeAdd) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_TYPES.TYPES_PREFIX, requestObject, true);
  };
  getProjectTypeById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_TYPES.TYPES_PREFIX}/${id}`, true);
  };

  updateProjectType = (id: number, requestObject: IProjectTypeAdd) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_TYPES.TYPES_PREFIX}/${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_TYPES.TYPES_PREFIX}/${id}/${status}`, {});
  };
}
