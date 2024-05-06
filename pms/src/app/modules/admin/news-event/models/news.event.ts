import { IPaginationParams } from "@models/common.model";

export interface INewsEventSearchParams extends IPaginationParams {
    search: string;
    startDate?: Date | string
    endDate?: Date | string;
    isActive: boolean;
}

export interface INewsEvent {
    title: string;
    startDate: string;
    endDate: string;
    newsEventFileName: string;
    newsEventUniqueFileName: string;
    isActive: boolean;
    createdOn: string;
    createdBy: number;
    createdByName: string;
}

export interface INewsEventObject extends INewsEvent {
    id: number;
}

export interface INewsEventList {
    records: INewsEventObject[];
    totalRecords: number;
}

export interface IFileList {
    id: number;
    name: string;
}
