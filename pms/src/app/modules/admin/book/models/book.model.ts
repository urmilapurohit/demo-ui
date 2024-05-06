import { IPaginationParams } from "@models/common.model";

export interface IBook {
    name: string;
    bookCategoryId: number;
    bookCategoryName?: string;
    author: string;
    description: string;
    isActive: boolean;
}

export interface IBookObject extends IBook {
    id: number;
}

export interface IBookList {
    records: IBookObject[]
    totalRecords: number;
}

export interface IBookSearchParams extends IPaginationParams {
    search: string;
    bookCategoryId: number;
    isActive: boolean;
}
