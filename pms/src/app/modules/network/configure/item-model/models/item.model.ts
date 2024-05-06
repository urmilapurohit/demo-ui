import { IPaginationParams } from "@models/common.model";

export interface IItemModelSearchParams extends IPaginationParams {
    search: string;
    networkItemTypeId: number;
    isActive: boolean;
}

export interface IItemModel {
    networkItemTypeId: number;
    networkItemTypeName?: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface IItemModelObject extends IItemModel {
    id: number;
}

export interface IItemModelList {
    records: IItemModelObject[];
    totalRecords: number;
}
