import { IPaginationParams } from "@models/common.model";

export interface IEmailTemplate {
    subject: string,
    templateHeader: string,
    templateData: string,
    isActive: boolean,
    name: string,
    token: string
}

export interface IEmailTemplateObject extends IEmailTemplate {
    id: number;
}

export interface IEmailTemplateList {
    records: IEmailTemplateObject[]
    totalRecords: number;
}

export interface IEmailTemplateSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean
}
