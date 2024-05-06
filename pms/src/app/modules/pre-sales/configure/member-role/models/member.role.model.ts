import { IPaginationParams } from "@models/common.model";

export interface IMemberRole {
    memberId: number;
    isBde: boolean;
    isBa: boolean;
    isPreSalesAdmin: boolean;
    onedrivePath: string;
    isActive: boolean;
}

export interface IMemberRoleObject extends IMemberRole {
    id: number;
}

export interface IMemberRoleList {
    records: IMemberRoleObject[]
    totalRecords: number;
}

export interface IMemberRoleSearchParams extends IPaginationParams {
    memberName: string;
    designationId: number;
    isActive: boolean;
}
