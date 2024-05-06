import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { ILookupCategorySearchParams } from '../models/lookup.category';

@Injectable({
  providedIn: 'root'
})
export class LookupCategoryService {
  constructor(private httpService: HttpService) { }

  getLookupCategory = (requestObject: ILookupCategorySearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.LOOKUP_CATEGORY.GET_LOOKUP_CATEGORY, requestObject);
  };

  getLookupCategoryById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.LOOKUP_CATEGORY.GET_LOOKUP_CATEGORY_BY_ID}${id}`);
  };

  updateEditableStatus = (id: number, flag: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.LOOKUP_CATEGORY.GET_LOOKUP_CATEGORY_BY_ID}${id}/${flag}`, {}, true);
  };
}
