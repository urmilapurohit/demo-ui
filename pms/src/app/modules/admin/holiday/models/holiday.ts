import { IPaginationParams } from "@models/common.model";

export interface IHoliday {
    remark?: string;
    date: string;
    isPublicHoliday: boolean;
    holidayType?: string;
    createdOn?: string;
    modifiedOn?: string;
}

export interface IHolidayObject extends IHoliday {
    id: number;
}

export interface HolidayType {
    date: string;
    holidayType: string;
    id: number;
    isPublicHoliday: boolean;
    remark: string;
}

export interface IHolidayList {
    records: IHolidayObject[]
    totalRecords: number;
}

export interface IHolidaySearchParams extends IPaginationParams {
    remark: string;
    startDate?: Date | string;
    endDate?: Date | string;
    isPublicHoliday: boolean | null;
}
