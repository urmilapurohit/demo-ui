import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IProjectGroup, IProjectGroupSearchParams } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(
    private httpService: HttpService
  ) { }

  getProjectGroups = (requestObject: IProjectGroupSearchParams) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_GROUPS.GET_GROUPS, requestObject);
  };

  addProjectGroup = (requestObject: IProjectGroup) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_GROUPS.GROUPS_PREFIX, requestObject, true);
  };

  getProjectGroupById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_GROUPS.GROUPS_PREFIX}/${id}`, true);
  };

  updateProjectGroup = (id: number, requestObject: IProjectGroup) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_GROUPS.GROUPS_PREFIX}/${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_GROUPS.GROUPS_PREFIX}/${id}/${status}`, {});
  };
}
