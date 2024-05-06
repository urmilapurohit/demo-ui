import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { ILookupCategoryDetail, ILookupCategoryDetailSearchParams } from '../models/lookup.category.detail';

@Injectable({
  providedIn: 'root'
})
export class LookupCategoryDetailService {
  constructor(
    private httpService: HttpService
  ) { }

  getLookupCategoryDetails = (requestObject: ILookupCategoryDetailSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_LOOKUP_CATEGORY_DETAIL, requestObject);
  };

  getEditableLookupCategories = () => {
    return this.httpService.get(API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_EDITABLE_LOOKUP_CATEGORY);
  };

  getLookupCategories = () => {
    return this.httpService.get(API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_LOOKUP_CATEGORY);
  };

  addLookupCategoryDetail = (requestObject: ILookupCategoryDetail) => {
    return this.httpService.post(API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.ADD_LOOKUP_CATEGORY_DETAIL, requestObject, true);
  };

  getLookupCategoryDetailById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_LOOKUP_CATEGORY_DETAIL_BY_ID}${id}`);
  };

  updateLookupCategoryDetail = (id: number, requestObject: ILookupCategoryDetail) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_LOOKUP_CATEGORY_DETAIL_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.GET_LOOKUP_CATEGORY_DETAIL_BY_ID}${id}/${status}`, {}, true);
  };
}
