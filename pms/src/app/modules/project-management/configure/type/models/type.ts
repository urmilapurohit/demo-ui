import { IPaginationParams } from "@models/common.model";

export interface IProjectType {
    name: string;
    isActive: boolean;
    isDefault: boolean;
    displayOrder: number;
}

export interface IProjectTypeObject extends IProjectType {
    id: number;
}

export interface IProjectTypeList {
    records: IProjectTypeObject[]
    totalRecords: number;
}

export interface IProjectTypeSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
export interface IProjectTypeAdd {
    name:string;
    isActive:boolean;
    displayOrder: number;
}
