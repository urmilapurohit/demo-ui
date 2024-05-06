import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common/services/http.service';
import { API_ROUTES } from '../../../../common/constants/apiroutes';
import { ITeamManageSearchParams } from '../models/manage';

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  constructor(private httpService: HttpService) {}

  getDesignations = () => {
    return this.httpService.get(API_ROUTES.TEAM.MANAGE.GET_DESIGNATIONS);
  };

  getPMTeamLeads = (showAllLeads: boolean) => {
    return this.httpService.get(`${API_ROUTES.TEAM.MANAGE.GET_PM_TEAM_LEADS}${showAllLeads}`);
  };

  getReportingMembers = () => {
    return this.httpService.get(API_ROUTES.TEAM.MANAGE.GET_REPORTING_MEMBERS);
  };

  getTechnicalSkills = () => {
    return this.httpService.get(API_ROUTES.TEAM.MANAGE.GET_TECHNICAL_SKILLS);
  };

  getTeamManageList = (requestObject: ITeamManageSearchParams) => {
    return this.httpService.post(API_ROUTES.TEAM.MANAGE.GET_TEAM_MANAGE, requestObject);
  };

  updateReportingToMember = (id: string, reportingToMemberId: string) => {
    return this.httpService.put(`${API_ROUTES.TEAM.MANAGE.UPDATE_REPORTING_TO_MEMBER}${id}/${reportingToMemberId}`, null);
  };

  getTeamHierarchy = (id?: number) => {
    return this.httpService.get(`${API_ROUTES.TEAM.MANAGE.GET_TEAM_HIERARCHY}${id ? `/${id}` : ''}`);
  };

  exportToExcel = (requestObject: ITeamManageSearchParams, responseType: string) => {
    return this.httpService.post(API_ROUTES.TEAM.MANAGE.EXPORT_TO_EXCEL, requestObject, false, undefined, responseType);
  };
}
