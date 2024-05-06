import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IHoliday, IHolidaySearchParams } from '../models/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  constructor(
    private httpService: HttpService
  ) { }

  getHoliday = (requestObject: IHolidaySearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.HOLIDAY.GET_HOLIDAY, requestObject);
  };

  getPublicHolidayById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.HOLIDAY.GET_HOLIDAY_BY_ID}${id}`);
  };

  addPublicHoliday = (requestObject: IHoliday) => {
    return this.httpService.post(API_ROUTES.ADMIN.HOLIDAY.ADD_HOLIDAY, requestObject, true);
  };

  addWeekOff = (requestObject: any) => {
    return this.httpService.post(API_ROUTES.ADMIN.HOLIDAY.ADD_WEEKOFF, requestObject, true);
  };

  updatePublicHoliday = (id: number, requestObject: IHoliday) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.HOLIDAY.UPDATE_HOLIDAY}${id}`, requestObject, true);
  };

  deleteHoliday = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.ADMIN.HOLIDAY.DELETE_HOLIDAY}${id}`, true);
  };
}
