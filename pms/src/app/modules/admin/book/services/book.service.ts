import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IBook, IBookSearchParams } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private httpService: HttpService
  ) { }

  getBooks = (requestObject: IBookSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.BOOK.GET_BOOK, requestObject);
  };

  getBookCategories = () => {
    return this.httpService.get(API_ROUTES.ADMIN.BOOK.GET_BOOK_CATEGORY);
  };

  addBook = (requestObject: IBook) => {
    return this.httpService.post(API_ROUTES.ADMIN.BOOK.ADD_BOOK, requestObject, true);
  };

  getBookById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.BOOK.GET_BOOK_BY_ID}${id}`);
  };

  updateBook = (id: number, requestObject: IBook) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.BOOK.GET_BOOK_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.BOOK.GET_BOOK_BY_ID}${id}/${status}`, {}, true);
  };
}
