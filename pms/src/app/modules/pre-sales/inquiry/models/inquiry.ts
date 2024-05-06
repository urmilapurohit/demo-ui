import { IPaginationParams } from "@models/common.model";

export interface IInquirySearchParams extends IPaginationParams {
    bdeIds?: string;
    baIds?: string;
    statusIds?: string;
    search: string;
    fromDate?: Date | string;
    toDate?: Date | string;
    countryIds?: string;
    sourceIds?: string;
    ratings?: string;
    projectTechnologyIds?: string;
    typeId?: number;
    isOpenInquiries?: boolean;
}

export interface IInquiry {
    date: Date | string;
    countryId: number;
    countryName?: string;
    statusId: number;
    statusName?: string;
    bdeId: number;
    bdeName?: string;
    projectName: string;
    clientBudget?: string;
    rating: string;
    sourceId: number;
    sourceName?: string;
    expectedDateBde: Date | string;
    estimatedGivenDate: Date | string;
    baIds: string;
    baNames: string;
    otherMember?: string;
    projectTechnologyIds: string;
    projectTechnologies?: string;
    hours?: string;
    onedrivePath?: string;
    closedLostReasonId?: number;
    closedLostReasonName?: string;
    closedLostOtherReason?: string;
    typeId?: number;
    typeName?: string;
    isActive: boolean;
    lastUpdatedOn: Date | string;
    preSalesHistories?: IPreSalesHistory[];
}

export interface IInquiryObject extends IInquiry {
    id: number;
}

export interface IInquiryList {
    records: IInquiryObject[];
    totalRecords: number;
}

export interface IPreSalesHistory {
    id: number;
    preSalesId: number;
    version?: number;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    modifiedOn?: Date | string;
    modifiedBy?: number;
    modifiedByName?: string;
}

export interface IPreSalesRemark {
    remark?: string;
    createdOn?: Date | string;
    memberName?: string;
}

export interface IUpdateInquiry {
    date: Date | string;
    countryId: number;
    statusId: number;
    bdeId: number;
    projectName: string;
    clientBudget?: string;
    rating: string;
    sourceId: number;
    expectedDateBde?: Date | string | null;
    estimatedGivenDate?: Date | string | null;
    baIds: string;
    otherMember?: string;
    projectTechnologyIds: string;
    hours?: string;
    onedrivePath?: string;
    closedLostReasonId?: number;
    closedLostOtherReason?: string;
    typeId?: number;
    isActive?: boolean;
    remark?: string;
}
export interface IPersonalizedViewObject {
    id: number;
    columnIds: string;
}

export interface ISearchCriteriaContent {
    searchName: string;
    bdeIds?: string;
    baIds?: string;
    statusIds?: string;
    search?: string;
    fromDate?: Date | string;
    toDate?: Date | string;
    countryIds?: string;
    sourceIds?: string;
    ratings?: string;
    projectTechnologyIds?: string;
    typeId?: number;
    isOpenInquiries?: boolean;
}

export interface ISavedSearchObj {
    id: number;
    searchName: string;
}

export interface ISavedSearchResponse extends ISavedSearchObj {
    searchCriteriaContent: ISearchCriteriaContent;
}

export interface IMemberRoleResponse {
    id?: number;
    memberId?: number;
    memberName?: string;
    memberDesignationId?: number;
    memberDesignation?: string;
    isBde: boolean;
    isBa: boolean;
    isPreSalesAdmin: boolean;
    onedrivePath?: string;
    isActive: boolean;
}

export interface IHistoryObject {
    id: number;
    version: number;
    modifiedOn: Date | string;
    modifiedBy: number;
    modifiedByName: string;
    historyDetails: IHistoryDetails[];
}

export interface IHistoryDetails {
    fieldName: string;
    oldValue: string;
    newValue: string;
}

export interface IStatusModel {
    id: number;
    name: string;
    isVisibleInBde: boolean;
    isVisibleInBa: boolean;
    isEstimationDateRequired: boolean;
}
