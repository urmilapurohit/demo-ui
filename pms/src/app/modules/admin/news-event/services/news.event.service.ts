import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { INewsEventSearchParams } from '../models/news.event';

@Injectable({
  providedIn: 'root'
})
export class NewsEventService {
  constructor(
    private httpService: HttpService,
  ) { }

  getNewsEvent = (requestObject: INewsEventSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.NEWS_EVENT.GET_NEWS_EVENT, requestObject);
  };

  addNewsEvent = (requestObject: FormData) => {
    return this.httpService.post(API_ROUTES.ADMIN.NEWS_EVENT.ADD_NEWS_EVENT, requestObject, true);
  };

  getNewsEventById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_PREFIX}${id}`);
  };

  updateNewsEvent = (id: number, requestObject: FormData) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_PREFIX}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_PREFIX}${id}/${status}`, {}, true);
  };

  getFilePreview = (id: number, requestType: string) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.NEWS_EVENT.FILE_PREVIEW}${id}`, false, undefined, requestType);
  };
}
