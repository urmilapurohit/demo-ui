import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IAddSelf, IGetAttendanceByDate, ISelfSearchParams } from '../models/self';

@Injectable({
  providedIn: 'root'
})

export class SelfService {
  constructor(
    private httpService: HttpService
  ) { }

  getSelf = (requestObject: ISelfSearchParams) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.REGULARIZE.SELF.GET_SELF, requestObject);
  };

  addSelf = (requestObject: IAddSelf) => {
    return this.httpService.post(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_PREFIX}add`, requestObject, true);
  };

  getSelfById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_PREFIX}${id}`);
  };

  updateSelf = (id: number, requestObject: IAddSelf) => {
    return this.httpService.put(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_PREFIX}${id}`, requestObject, true);
  };

  getAttendanceByDate = (requestObject: IGetAttendanceByDate) => {
    return this.httpService.post(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.GET_ATTENDANCE_BY_DATE}`, requestObject);
  };

  cancelSelf = (id: number) => {
    return this.httpService.put(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_CANCEL}${id}`, {}, true);
  };

  getHistories = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_HISTORIES}${id}`);
  };

  getSelfStatus = () => {
    return this.httpService.get(`${API_ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_STATUS}${false}/${true}`);
  };
}
