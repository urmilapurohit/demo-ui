import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IDepartment, IDepartmentSearchParams } from '../models/department';

@Injectable({
  providedIn: 'root'
})

export class DepartmentService {
  constructor(
    private baseService: HttpService
  ) { }

  getDepartments = (requestObject: IDepartmentSearchParams) => {
    return this.baseService.post(API_ROUTES.ADMIN.DEPARTMENT.GET_DEPARTMENT, requestObject);
  };

  addDepartment = (requestObject: IDepartment) => {
    return this.baseService.post(API_ROUTES.ADMIN.DEPARTMENT.ADD_DEPARTMENT, requestObject, true);
  };

  getDepartmentById = (id: number) => {
    return this.baseService.get(`${API_ROUTES.ADMIN.DEPARTMENT.GET_DEPARTMENT_BY_ID}${id}`);
  };

  updateDepartment = (id: number, requestObject: IDepartment) => {
    return this.baseService.put(`${API_ROUTES.ADMIN.DEPARTMENT.GET_DEPARTMENT_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.baseService.put(`${API_ROUTES.ADMIN.DEPARTMENT.GET_DEPARTMENT_BY_ID}${id}/${status}`, {}, true);
  };
}
