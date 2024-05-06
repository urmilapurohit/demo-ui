import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { ICorrect } from '../models/correct';

@Injectable({
  providedIn: 'root'
})
export class CorrectService {
  constructor(
    private httpService: HttpService
  ) { }

  correctAttendance = (requestObject: ICorrect) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.CORRECTION.SAVE_CORRECTION, requestObject, true);
  };

  getMembers = (requestObject: { search: string }) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.CORRECTION.GET_MEMBERS, requestObject);
  };

  checkAttendance = (requestObject: ICorrect) => {
    return this.httpService.post(API_ROUTES.ATTENDANCE.CORRECTION.CHECK_ATTENDANCE, requestObject, true);
  };
}
