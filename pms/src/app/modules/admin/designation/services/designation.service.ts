import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IDesignation, IDesignationSearchParams } from '../models/designation';

@Injectable({
  providedIn: 'root'
})

export class DesignationService {
  constructor(
    private httpService: HttpService
  ) { }

  getDesignation = (requestObject: IDesignationSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.DESIGNATION.GET_DESIGNATION, requestObject);
  };

  addDesignation = (requestObject: IDesignation) => {
    return this.httpService.post(API_ROUTES.ADMIN.DESIGNATION.ADD_DESIGNATION, requestObject, true);
  };

  deleteDesignation = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.ADMIN.DESIGNATION.DELETE_DESIGNATION}${id}`, true);
  };

  getDesignationById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.DESIGNATION.GET_DESIGNATION_BY_ID}${id}`);
  };

  updateDesignation = (id: number, requestObject: IDesignation) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.DESIGNATION.GET_DESIGNATION_BY_ID}${id}`, requestObject, true);
  };
}
