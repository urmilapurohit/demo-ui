import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IBookCategory, IBookCategorySearchParams } from '../models/book.category';

@Injectable({
  providedIn: 'root'
})
export class BookCategoryService {
  constructor(
    private httpService: HttpService
  ) { }

  getBookCategory = (requestObject: IBookCategorySearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.BOOK_CATEGORY.GET_BOOK_CATEGORY, requestObject);
  };

  getBookCategoryById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.BOOK_CATEGORY.GET_BOOK_CATEGORY_BY_ID}${id}`);
  };

  addBookCategory = (requestObject: IBookCategory) => {
    return this.httpService.post(API_ROUTES.ADMIN.BOOK_CATEGORY.ADD_BOOK_CATEGORY, requestObject, true);
  };

  updateBookCategory = (id: number, requestObject: IBookCategory) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.BOOK_CATEGORY.UPDATE_BOOK_CATEGORY}${id}`, requestObject, true);
  };

  deleteBookCategory = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.ADMIN.BOOK_CATEGORY.DELETE_BOOK_CATEGORY}${id}`, true);
  };
}
