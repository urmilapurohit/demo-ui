import { IPaginationParams } from "workspace-library";

export interface ISystemType {
    name: string;
    systemTypeItemDetails?: IItemTypes[];
    isActive: boolean;
}

export interface IItemTypes {
    systemTypeItemDetailId?: number;
    networkItemTypeId?: number;
    isRequired?: boolean;
}

export interface ISystemTypeObject extends ISystemType {
    id: number;
}

export interface ISystemTypeList {
    records: ISystemTypeObject[]
    totalRecords: number;
}

export interface ISystemTypeSearchParams extends IPaginationParams {
    search: string;
    isActive: boolean;
}
