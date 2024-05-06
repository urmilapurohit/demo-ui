import { IPaginationParams } from "@models/common.model";

export interface ILookupCategoryDetail {
    name: string;
    lookupCategoryId: number;
    isActive?: boolean;
    isEditable?: boolean;
    lookupCategoryName?: string
    description: string;
    displayOrder: number;
}

export interface ILookupCategoryDetailObject extends ILookupCategoryDetail {
    id: number;
}

export interface ILookupCategoryDetailList {
    records: ILookupCategoryDetailObject[]
    totalRecords: number;
}

export interface ILookupCategoryDetailSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
    lookupCategoryId: number;
}
