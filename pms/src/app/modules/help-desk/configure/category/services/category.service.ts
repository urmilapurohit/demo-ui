import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ICategorySearchParams, ICategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private httpService: HttpService
  ) { }

  getCategories = () => {
    return this.httpService.get(API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_CATEGORY_LIST);
  };
  getDepartments = () => {
    return this.httpService.get(API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_DEPARTMENT_LIST);
  };
  getCategory = (requestObject: ICategorySearchParams) => {
    return this.httpService.post(API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_CATEGORY, requestObject);
  };
  addCategory = (requestObject: ICategory) => {
    return this.httpService.post(API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.ADD_CATEGORY, requestObject, true);
  };
  deleteCategory = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_CATEGORY_BY_ID}/${id}`);
  };
  getCategoryById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_CATEGORY_BY_ID}/${id}`, true);
  };
  getSubCategory = (id: number) => {
    return this.httpService.post(`${API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_SUB_CATEGORY_LIST}/${id}`, {});
  };
  updateCategory = (id: number, requestObject: ICategory) => {
    return this.httpService.put(`${API_ROUTES.HELP_DESK.CONFIGURE.CATEGORY.GET_CATEGORY_BY_ID}/${id}`, requestObject, true);
  };
}
