import { IPaginationParams } from "@models/common.model";

export interface IStatus {
    name: string;
    displayOrder: number;
    isVisibleInBde: boolean;
    isVisibleInBa: boolean;
    isOpenInquiry: boolean;
    isEstimationDateRequired: boolean;
    isSendStatusChangeMail: boolean;
    isSendStatusChangeMailToBde: boolean;
    isSendStatusChangeMailToBa: boolean;
    isSendStatusChangeMailToPreSalesAdmin: boolean;
    sendStatusChangeMailToOtherMemberIds: string;
}

export interface IStatusObject extends IStatus {
    id: number;
    isDefault: boolean;
}

export interface IStatusList {
    records: IStatusObject[]
    totalRecords: number;
}

export interface IStatusSearchParams extends IPaginationParams {
    search: string;
}
