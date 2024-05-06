import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';

@Injectable({
  providedIn: 'root'
})
export class TeamEfficiencyReportService {
  constructor(
    private httpService: HttpService
  ) { }

  getTeamEfficiencyReport = (id: number) => {
    return this.httpService.get(`${API_ROUTES.TEAM.CONFIGURE.EFFICIENCY_REPORT.GET_EFFICIENCY_REPORT}${id}`, true);
  };

  saveTeamEfficiencyReport = (requestObject: any) => {
    return this.httpService.put(API_ROUTES.TEAM.CONFIGURE.EFFICIENCY_REPORT.GET_EFFICIENCY_REPORT_BY_ID, requestObject, true);
  };

  getProjectManagers = () => {
    return this.httpService.get(API_ROUTES.TEAM.CONFIGURE.EFFICIENCY_REPORT.GET_PROJECT_MANAGERS_LIST, true);
  };
}
