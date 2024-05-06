import { IPaginationParams } from "@models/common.model";

export interface IDepartment {
    name: string;
    isActive: boolean;
    departmentEmail: string;
    departmentEmailCc: string;
}

export interface IDepartmentObject extends IDepartment {
    id: number;
}

export interface IDepartmentList {
    records: IDepartmentObject[]
    totalRecords: number;
}

export interface IDepartmentSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
