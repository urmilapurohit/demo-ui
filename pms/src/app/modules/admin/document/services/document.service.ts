import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IDocumentSearchParams } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(
    private httpService: HttpService
  ) { }

  getDocuments = (requestObject: IDocumentSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT, requestObject);
  };

  getDocumentCategories = () => {
    return this.httpService.get(API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_CATEGORY);
  };

  addDocument = (requestObject: FormData) => {
    return this.httpService.post(API_ROUTES.ADMIN.DOCUMENT.ADD_DOCUMENT, requestObject, true);
  };

  getDocumentById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_BY_ID}${id}`);
  };

  getDocumentPreview = (id: number, responseType: string) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.DOCUMENT.DOCUMENT_PREVIEW}${id}`, false, undefined, responseType);
  };

  updateDocument = (id: number, requestObject: FormData) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_BY_ID}${id}/${status}`, {}, true);
  };
}
