import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IGetAttendanceModel, IGetPendingAttendanceRequest, IGetRORequestObject, ISaveAttendanceModel } from '../models/team.attendance.model';

@Injectable({
    providedIn: 'root'
})

export class TeamAttendanceService {
    constructor(
        private baseService: HttpService
    ) { }

    GetAttendance = (requestObject: IGetAttendanceModel) => {
        return this.baseService.post(API_ROUTES.ATTENDANCE.TEAM.GET_ATTENDANCE, requestObject, true);
    };

    SaveAttendance = (requestObject: ISaveAttendanceModel[]) => {
        return this.baseService.post(API_ROUTES.ATTENDANCE.TEAM.SAVE_ATTENDANCE, requestObject, true);
    };

    GetReportingPerson = (isAllRO: boolean, requestObject: IGetRORequestObject) => {
        return this.baseService.post(`${API_ROUTES.ATTENDANCE.TEAM.GET_REPORTING_PERSON}${isAllRO}`, requestObject);
    };

    GetPendingAttendance = (requestObject: IGetPendingAttendanceRequest) => {
        return this.baseService.post(`${API_ROUTES.ATTENDANCE.TEAM.TEAM_PENDING_ATTENDANCE}`, requestObject);
    };
}
