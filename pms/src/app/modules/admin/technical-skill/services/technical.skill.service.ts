import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ITechnicalSkill, ITechnicalSkillSearchParams } from '../models/technical.skill';

@Injectable({
  providedIn: 'root'
})
export class TechnicalSkillService {
  constructor(
    private httpService: HttpService
  ) { }

  getTechnicalSkills = (requestObject: ITechnicalSkillSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.TECHNICAL_SKILL.GET_TECHNICAL_SKILL, requestObject);
  };

  addTechnicalSkill = (requestObject: ITechnicalSkill) => {
    return this.httpService.post(API_ROUTES.ADMIN.TECHNICAL_SKILL.ADD_TECHNICAL_SKILL, requestObject, true);
  };

  getTechnicalSkillById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.TECHNICAL_SKILL.GET_TECHNICAL_SKILL_BY_ID}${id}`);
  };

  updateTechnicalSkill = (id: number, requestObject: ITechnicalSkill) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.TECHNICAL_SKILL.GET_TECHNICAL_SKILL_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.TECHNICAL_SKILL.GET_TECHNICAL_SKILL_BY_ID}${id}/${status}`, {}, true);
  };
}
