import { IPaginationParams } from "workspace-library";

export interface IProjectGroup {
    name: string;
    description:string;
    isActive: boolean;
}

export interface IProjectGroupObject extends IProjectGroup {
    id: number;
}

export interface IProjectGroupList {
    records: IProjectGroupObject[]
    totalRecords: number;
}

export interface IProjectGroupSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
