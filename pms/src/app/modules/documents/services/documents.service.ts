import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  constructor(
    private httpService: HttpService,
  ) { }

  getCategory() {
    return this.httpService.get(API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_CATEGORY);
  }

  getDocumentTitles(id: number) {
    return this.httpService.get(`${API_ROUTES.ADMIN.DOCUMENT.GET_DOCUMENT_BY_SUB_CATEGORY_ID}${id}`);
  }

  getDocument(id: number, responseType: string) {
    return this.httpService.get(`${API_ROUTES.DOCUMENTS.DOCUMENTS_DOWNLOAD}/${id}`, true, undefined, responseType);
  }
}
