import { IPaginationParams } from "@models/common.model";

export interface ISelf {
    attendanceDate: string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
    attendanceRegularizationStatusId: number;
    attendanceRegularizationStatus: string
}

export interface ISelfObject extends ISelf {
    id: number;
}

export interface ISelfList {
    records: ISelfObject[]
    totalRecords: number;
}

export interface ISelfSearchParams extends IPaginationParams {
    startDate?: Date | string;
    endDate?: Date | string;
    attendanceRegularizationStatusId?:number;
}
export interface IAddSelf {
    attendanceDate: string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
}

export interface ISelfHistory {
    name: string;
    status: string;
    comments?: string | "";
}

export interface ISelfHistoryObject extends ISelfHistory {
    id: number;
}

export interface ISelfHistoryList {
    records: ISelfHistoryObject[]
    totalRecords: number;
}

export interface IGetAttendanceByDate {
    attendanceDate?: Date | string
  }
