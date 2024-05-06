import { IPaginationParams } from "@models/common.model";

export interface IDesignation {
    name: string;
    abbreviation: string,
    canBeAssessor: boolean,
    canBeReviewer: boolean,
    canBeProjectMember: boolean
}

export interface IDesignationObject extends IDesignation {
    id: number;
}

export interface IDesignationList {
    records: IDesignationObject[]
    totalRecords: number;
}

export interface IDesignationSearchParams extends IPaginationParams {
    search: string;
    abbreviation: string;
}
