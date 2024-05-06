import { IPaginationParams } from "@models/common.model";

export interface ITechnology {
    name: string;
    displayOrder: number;
}

export interface ITechnologyObject extends ITechnology {
    id: number;
}

export interface ITechnologyList {
    records: ITechnologyObject[]
    totalRecords: number;
}

export interface ITechnologySearchParams extends IPaginationParams {
    search: string;
}
