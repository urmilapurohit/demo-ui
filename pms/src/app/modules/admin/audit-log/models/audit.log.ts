import { IPaginationParams } from "@models/common.model";

export interface IAuditLogSearchParams extends IPaginationParams {
    startDate?: Date | string;
    endDate?: Date | string;
    typeId?: number,
  moduleId?: number,
  modulePageId?: number,
  memberIds?: number[]
}
export interface IAuditLog {

    createdOn: Date | string,
        userName: string,
        moduleName: string,
        pageName: string,
        details:string,
        ipAddress: string,
        browser: string
}

export interface IAuditLogObject extends IAuditLog {
    id: number;
}

export interface IAuditLogList {
    records: IAuditLogObject[]
    totalRecords: number;
}
export interface IAuditLogDelete {
    ids:string
}
