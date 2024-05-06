import { IPaginationParams } from "@models/common.model";

export interface IErrorLogSearchParams extends IPaginationParams {
    startDate?: Date | string;
    endDate?: Date | string;
}
export interface IErrorLog {
    createdOn: string
    memberId: number;
    memberName: string;
    ipAddress: string;
    clientBrowser: string;
    errorMessage: string;
    errorStackTrace: string;
}

export interface IErrorLogObject extends IErrorLog {
    id: number;
}

export interface IErrorLogList {
    records: IErrorLogObject[]
    totalRecords: number;
}
export interface IErrorLogDelete {
    ids:string
}
