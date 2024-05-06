import { IPaginationParams } from "@models/common.model";

export interface ISystemStatus {
    name: string;
    color: number;
    displayOrder: number;
    isActive: boolean;
}

export interface ISystemStatusObject extends ISystemStatus {
    id: number;
}

export interface ISystemStatusList {
    records: ISystemStatusObject[]
    totalRecords: number;
}

export interface ISystemStatusSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
