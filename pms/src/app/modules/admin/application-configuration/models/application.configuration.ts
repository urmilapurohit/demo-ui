import { IPaginationParams } from "@models/common.model";

export interface IApplicationConfiguration {
    name?: string;
    description?: string,
    configValue: string,
    dataType?: string
}

export interface IApplicationConfigurationObject extends IApplicationConfiguration {
    id: number;
}

export interface IApplicationConfigurationList {
    records: IApplicationConfigurationObject[]
    totalRecords: number;
}

export interface IApplicationConfigurationSearchParams extends IPaginationParams {
    search: string;
}
