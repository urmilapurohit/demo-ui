import { IPaginationParams } from "@models/common.model";

export interface IVendor {
    name: string;
    phoneNo: number;
    alternatePhoneNo: number;
    address: string;
    comments: string;
    isActive: boolean;
}

export interface IVendorObject extends IVendor {
    id: number;
}

export interface IVendorList {
    records: IVendorObject[]
    totalRecords: number;
}

export interface IVendorSearchParams extends IPaginationParams {
    search: string;
    phoneNo: string;
    alternatePhoneNo: string;
    isActive: boolean;
}
