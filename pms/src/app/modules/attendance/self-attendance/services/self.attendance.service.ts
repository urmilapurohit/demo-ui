import { Injectable } from '@angular/core';
import { HttpService } from '../../../../common/services/http.service';
import { IGetAttendanceModel, ISaveAttendanceModel } from '../models/self.attendance.model';
import { API_ROUTES } from '../../../../common/constants/apiroutes';

@Injectable({
    providedIn: 'root'
})

export class SelfAttendanceService {
    constructor(
        private baseService: HttpService
    ) { }

    GetAttendance = (requestObject: IGetAttendanceModel) => {
        return this.baseService.post(API_ROUTES.ATTENDANCE.SELF.GET_ATTENDANCE, requestObject, true);
    };

    SaveSelfAttendance = (requestObject: ISaveAttendanceModel) => {
        return this.baseService.post(API_ROUTES.ATTENDANCE.SELF.SAVE_ATTENDANCE, requestObject, true);
    };
}
