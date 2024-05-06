import { IPaginationParams } from "@models/common.model";

export interface IProjectStatus {
    name: string;
    isActive: boolean;
    isDefault: boolean;
    displayOrder: number;
}

export interface IProjectStatusObject extends IProjectStatus {
    id: number;
}

export interface IProjectStatusList {
    records: IProjectStatusObject[]
    totalRecords: number;
}

export interface IProjectStatusSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
export interface IProjectStatusAdd {
    name: string;
    isActive: boolean;
    displayOrder: number;
}
