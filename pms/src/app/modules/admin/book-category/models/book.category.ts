import { IPaginationParams } from "@models/common.model";

export interface IBookCategory {
    name: string;
}

export interface IBookCategoryObject extends IBookCategory {
    id: number;
}

export interface IBookCategoryList {
    records: IBookCategoryObject[]
    totalRecords: number;
}

export interface IBookCategorySearchParams extends IPaginationParams {
    search: string;
}
