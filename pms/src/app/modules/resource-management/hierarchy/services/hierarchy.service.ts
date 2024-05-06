import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {
  constructor(private httpService: HttpService) { }

  getTeamHierarchy = (id?: number) => {
    return this.httpService.get(`${API_ROUTES.RESOURCE_MANAGEMENT.HIERARCHY.GET_TEAM_HIERARCHY}${id ? `/${id}` : ''}`, true);
  };
}
