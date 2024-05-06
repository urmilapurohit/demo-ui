import { IPaginationParams } from "@models/common.model";

export interface IDocumentCategory {
    name: string;
    documents?: string[];
}

export interface IDocumentCategoryObject extends IDocumentCategory {
    id: number;
}

export interface IDocumentCategoryList {
    records: IDocumentCategoryObject[]
    totalRecords: number;
}

export interface IDocumentCategorySearchParams extends IPaginationParams {
    search: string;
}
