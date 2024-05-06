import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IDocumentCategory, IDocumentCategorySearchParams } from '../models/document.category';

@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {
  constructor(
    private httpService: HttpService
  ) { }

  getDocumentCategory = (requestObject: IDocumentCategorySearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.DOCUMENT_CATEGORY.GET_DOCUMENT_CATEGORY, requestObject);
  };

  getDocumentCategoryById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.DOCUMENT_CATEGORY.GET_DOCUMENT_CATEGORY_BY_ID}${id}`);
  };

  addDocumentCategory = (requestObject: IDocumentCategory) => {
    return this.httpService.post(API_ROUTES.ADMIN.DOCUMENT_CATEGORY.ADD_DOCUMENT_CATEGORY, requestObject, true);
  };

  updateDocumentCategory = (id: number, requestObject: IDocumentCategory) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.DOCUMENT_CATEGORY.UPDATE_DOCUMENT_CATEGORY}${id}`, requestObject, true);
  };

  deleteDocumentCategory = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.ADMIN.DOCUMENT_CATEGORY.DELETE_DOCUMENT_CATEGORY}${id}`, true);
  };
}
