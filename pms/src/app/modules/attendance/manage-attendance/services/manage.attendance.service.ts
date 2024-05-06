import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common/services/http.service';
import { API_ROUTES } from '../../../../common/constants/apiroutes';
import { IGetAttendanceModel, IGetPendingAttendanceRequest, IGetRORequestObject, ISaveAttendanceModel } from '../models/manage.attendance.model';

@Injectable({
  providedIn: 'root'
})
export class ManageAttendanceService {
  constructor(
    private baseService: HttpService
  ) { }

  GetAttendance = (requestObject: IGetAttendanceModel) => {
    return this.baseService.post(API_ROUTES.ATTENDANCE.MANAGE.GET_ATTENDANCE, requestObject, true);
  };

  SaveAttendance = (requestObject: ISaveAttendanceModel[]) => {
    return this.baseService.post(API_ROUTES.ATTENDANCE.MANAGE.SAVE_ATTENDANCE, requestObject, true);
  };

  GetReportingPerson = (isAllRO: boolean, requestObject: IGetRORequestObject) => {
    return this.baseService.post(`${API_ROUTES.ATTENDANCE.TEAM.GET_REPORTING_PERSON}${isAllRO}`, requestObject);
  };

  GetMissingAttendance = (requestObject: IGetPendingAttendanceRequest) => {
    return this.baseService.post(`${API_ROUTES.ATTENDANCE.MANAGE.MISSING_ATTENDANCE}`, requestObject);
  };
}
