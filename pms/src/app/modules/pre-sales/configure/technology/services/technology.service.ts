import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { ITechnology, ITechnologySearchParams } from '../models/technology.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  constructor(private httpService: HttpService) { }

  getTechnologies = (requestObject: ITechnologySearchParams) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.GET_TECHNOLOGY, requestObject);
  };

  getTechnologyById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.GET_TECHNOLOGY_BY_ID}${id}`);
  };

  addTechnology = (requestObject: ITechnology) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.ADD_TECHNOLOGY, requestObject, true);
  };

  updateTechnology = (id: number, requestObject: ITechnology) => {
    return this.httpService.put(`${API_ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.GET_TECHNOLOGY_BY_ID}${id}`, requestObject, true);
  };

  deleteTechnology = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.GET_TECHNOLOGY_BY_ID}${id}`, true);
  };
}
