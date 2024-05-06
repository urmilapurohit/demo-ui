import { IPaginationParams } from "@models/common.model";

export interface IItemTypeSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}

export interface IItemType {
    name: string;
    description: string;
    isActive: boolean;
    isSerialRequired: boolean;
}

export interface IItemTypeObject extends IItemType {
    id: number;
}

export interface IItemTypeList {
    records: IItemTypeObject[];
    totalRecords: number;
}
