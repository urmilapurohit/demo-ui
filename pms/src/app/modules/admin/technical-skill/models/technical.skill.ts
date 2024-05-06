import { IPaginationParams } from "@models/common.model";

export interface ITechnicalSkill {
    name: string;
    abbreviation: string;
    isActive: boolean;
}

export interface ITechnicalSkillObject extends ITechnicalSkill {
    id: number;
}

export interface ITechnicalSkillList {
    records: ITechnicalSkillObject[]
    totalRecords: number;
}

export interface ITechnicalSkillSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
