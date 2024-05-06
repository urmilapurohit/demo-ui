import { IPaginationParams } from "@models/common.model";

export interface IManage {
    name?: string;
    attendanceDate: Date | string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
    attendanceRegularizationStatus: string;
}

export interface IManageObject extends IManage {
    id: number;
}

export interface IManageList {
    records: IManageObject[]
    totalRecords: number;
}

export interface IManageSearchParams extends IPaginationParams {
    search: string;
    status: number;
    startDate?: Date | string;
    endDate?: Date | string;
}

export interface IManageHistory {
    name: string;
    status: string;
    approverComments?: string | "";
}

export interface IManageHistoryObject extends IManageHistory {
    id: number;
}

export interface IManageHistoryList {
    records: IManageHistoryObject[]
    totalRecords: number;
}

export interface IManageHistorySearchParams extends IPaginationParams {
    search: string;
}

export interface IManageUpdate {
    status: number,
    comments: string
}

export interface IManageDetails {
    id: string;
    attendanceDate: Date | string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
    attendanceRegularizationStatusId: number;
    comments: string,
}
