import { IPaginationParams } from "@models/common.model";

export interface INotification {
    notificationTypeId: number;
    priorityId: number;
    title: string;
    description?: string;
    isActive: boolean;
}

export interface INotificationObject extends INotification {
    id: number;
}

export interface INotificationList {
    records: INotificationObject[]
    totalRecords: number;
}

export interface INotificationSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
    notificationTypeId?: number;
}
