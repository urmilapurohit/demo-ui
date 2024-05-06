import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { UserThemes } from '@constants/Enums';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(
    private httpService: HttpService
  ) { }

  getTechnicalSkills = () => {
    return this.httpService.get(API_ROUTES.GENERAL.GET_TECHNICAL_SKILLS);
  };

  updateMemberTechnicalSkills = (id: string, technicalSkills: string[]) => {
    return this.httpService.put(`${API_ROUTES.GENERAL.UPDATE_MEMBER_TECHNICAL_SKILLS}${id}`, technicalSkills);
  };

  updateUserThemePreference = (theme: UserThemes) => {
    return this.httpService.put(`${API_ROUTES.GENERAL.UPDATE_USER_PREFERENCE}${theme}`, {});
  };

  getMembers = () => {
    return this.httpService.get(`${API_ROUTES.GENERAL.GET_MEMBERS}`);
  };
}
