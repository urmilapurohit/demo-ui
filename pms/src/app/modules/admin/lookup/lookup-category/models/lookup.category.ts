import { IPaginationParams } from "@models/common.model";

export interface ILookupCategory {
    name: string;
    isEditable?: boolean;
}

export interface ILookupCategoryObject extends ILookupCategory {
    id: number;
}

export interface ILookupCategoryList {
    records: ILookupCategoryObject[]
    totalRecords: number;
}

export interface ILookupCategorySearchParams extends IPaginationParams {
    search: string;
    isEditable: boolean;
}
