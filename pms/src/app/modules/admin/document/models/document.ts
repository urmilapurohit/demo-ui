import { IPaginationParams } from "@models/common.model";

export interface IDocument {
    title: string;
    documentCategoryId: number;
    documentCategoryName?: string;
    documentFileName?: string;
    displayOrder: number;
    isActive: boolean;
}

export interface IFileData {
    fileName: string;
    uniqueFileName: string;
    formFile: any;
}

export interface IDocumentObject extends IDocument {
    id: number;
}

export interface IDocumentList {
    records: IDocumentObject[]
    totalRecords: number;
}

export interface IDocumentSearchParams extends IPaginationParams {
    name: string;
    documentCategoryId: number;
    isActive: boolean;
}

export interface IFileListType {
    id: number;
    name: string;
}
