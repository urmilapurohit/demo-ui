import { IPaginationParams } from "@models/common.model";

export interface IWidgetDetails {
    title?: string;
    isVisible: boolean;
}
export interface IWidgetDetailsObject extends IWidgetDetails {
    id: number;
}

export interface IWidgetDetailsList {
    records: IWidgetDetailsObject[]
    totalRecords: number;
}

export interface IWidgetDetailsSearchParams extends IPaginationParams {
}
