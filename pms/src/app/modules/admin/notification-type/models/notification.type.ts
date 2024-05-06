import { IPaginationParams } from "@models/common.model";

export interface INotificationType {
    name: string;
    isActive: boolean;
}

export interface INotificationTypeObject extends INotificationType {
    id: number;
}

export interface INotificationTypeList {
    records: INotificationTypeObject[]
    totalRecords: number;
}

export interface INotificationTypeSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
