import { IPaginationParams } from "@models/common.model";

export interface ICategory {
    parentHelpDeskCategoryId?: number | null;
    name: string;
    description: string;
    isApprovalRequired?: boolean;
    isSpecificDurationRequired?: boolean;
    departmentId?: number;
}

export interface ICategoryObject extends ICategory {
    id: number;
}

export interface ICategoryList {
    records: ICategoryObject[]
    totalRecords: number;
}

export interface ICategorySearchParams extends IPaginationParams {
    departmentId: number;
    categoryId: number
}
