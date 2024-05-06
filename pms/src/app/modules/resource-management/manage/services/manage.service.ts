import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IPorjectDetailsSearchParam, IResourceSearchParams } from '../models/manage';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  constructor(
    private httpService: HttpService
  ) { }

  getResourcesList = (requestObject: IResourceSearchParams) => {
    return this.httpService.post(API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_RESOURCE_LIST, requestObject);
  };
  getDesignations = () => {
    return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_DESIGNATIONS);
  };
  getDepartments = () => {
    return this.httpService.get(API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_DEPARTMENT_LIST);
  };
  getPMTL = () => {
    return this.httpService.get(API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_PM_TL);
  };
  getImmediateSeniorHistory = (id:number) => {
    return this.httpService.get(`${API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_IMMEDIATE_SENIOR_HISTORY}${id}`);
  };
  getProjectNature = () => {
    return this.httpService.get(API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_PROJECT_NATURE);
  };
  getProjectDetails = (data:IPorjectDetailsSearchParam) => {
    return this.httpService.post(API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_PROJECT_DETAILS, data, true);
  };
  getReportingMembers = () => {
    return this.httpService.get(API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.GET_REPORTING_MEMBERS);
  };
  updateReportingToMember = (id:number, reportingToMemberId:number) => {
    return this.httpService.put(`${API_ROUTES.RESOURCE_MANAGEMENT.MANAGE.UPDATE_REPORTING_TO_MEMBER}${id}/${reportingToMemberId}`, {}, true);
  };
}
