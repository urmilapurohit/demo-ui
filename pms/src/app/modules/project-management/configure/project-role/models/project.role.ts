import { IPaginationParams } from "@models/common.model";

export interface IProjectRole {
    name: string;
    isActive: boolean;
    abbreviation: string;
    isMemberIdRequired: boolean;
}

export interface IProjectRoleObject extends IProjectRole {
    id: number;
}

export interface IProjectRoleList {
    records: IProjectRoleObject[]
    totalRecords: number;
}

export interface IProjectRoleSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
