import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IProjectRole, IProjectRoleSearchParams } from '../models/project.role';

@Injectable({
  providedIn: 'root'
})
export class ProjectRoleService {
  constructor(
    private httpService: HttpService
  ) { }

  getProjectRoles = (requestObject: IProjectRoleSearchParams) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.GET_PROJECT_ROLE, requestObject);
  };

  addProjectRole = (requestObject: IProjectRole) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_PREFIX, requestObject, true);
  };
  getProjectRoleById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_PREFIX}/${id}`, true);
  };

  updateProjectRole = (id: number, requestObject: IProjectRole) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_PREFIX}/${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_PREFIX}/update-status/${id}/${status}`, {});
  };
}
