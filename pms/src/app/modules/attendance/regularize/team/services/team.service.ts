import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ITeamSearchParams, ITeamUpdate } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})

export class TeamService {
  constructor(
    private httpService: HttpService
  ) { }

  getTeam = (requestObject: ITeamSearchParams) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.REGULARIZE.TEAM.GET_TEAM, requestObject);
  };

  getTeamById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_PREFIX}${id}`);
  };

  updateTeam = (id: number, requestObject: ITeamUpdate) => {
    return this.httpService.put(`${API_ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_PREFIX}${id}`, requestObject, true);
  };

  getHistories = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_HISTORIES}${id}`);
  };

  getTeamStatus = () => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_STATUS}${false}/${true}`);
  };

  getSelfStatus = () => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_STATUS}${true}/${false}`);
  };
}
