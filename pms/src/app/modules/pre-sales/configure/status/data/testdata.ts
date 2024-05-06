import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";
import { IStatusList } from "../models/status.model";

export const testResponse: IStatusList = {
    records: [
        {
            id: 6,
            name: 'Accounts',
            displayOrder: 1,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 14,
            name: 'Admin',
            displayOrder: 3,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 4,
            name: 'Analysis',
            displayOrder: 5,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 12,
            name: 'Android',
            displayOrder: 7,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 3,
            name: 'Business Development',
            displayOrder: 31,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 9,
            name: 'Design',
            displayOrder: 32,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        },
        {
            id: 7,
            name: 'E-Marketing',
            displayOrder: 33,
            isVisibleInBde: true,
            isVisibleInBa: false,
            isOpenInquiry: true,
            isEstimationDateRequired: true,
            isSendStatusChangeMail: true,
            isSendStatusChangeMailToBde: true,
            isSendStatusChangeMailToBa: true,
            isSendStatusChangeMailToPreSalesAdmin: true,
            sendStatusChangeMailToOtherMemberIds: ""
        }
    ],
    totalRecords: 20,
};

export const testStatusData = {
    name: 'Test Status',
    displayOrder: 22,
    isVisibleInBde: true,
    isVisibleInBa: false,
    isOpenInquiry: true,
    isEstimationDateRequired: true,
    isSendStatusChangeMail: true,
    isSendStatusChangeMailToBde: true,
    isSendStatusChangeMailToBa: true,
    isSendStatusChangeMailToPreSalesAdmin: true,
    sendStatusChangeMailToOtherMemberIds: ""
};

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 14,
        name: 'Admin',
        displayOrder: 22,
        isVisibleInBde: true,
        isVisibleInBa: false,
        isOpenInquiry: true,
        isEstimationDateRequired: true,
        isSendStatusChangeMail: true,
        isSendStatusChangeMailToBde: true,
        isSendStatusChangeMailToBa: true,
        isSendStatusChangeMailToPreSalesAdmin: true,
        sendStatusChangeMailToOtherMemberIds: ""
    },
};
export const testSearchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name',
    pageSize: 10
};

export const testSortParam = {
    sortColumn: 'Name',
    search: '',
    sortBy: 'Name',
    sortDirection: 'asc'
};
export const testAddStatusData = {
    name: 'Test Status',
    displayOrder: 22,
    isVisibleInBde: true,
    isVisibleInBa: false,
    isOpenInquiry: true,
    isEstimationDateRequired: true,
    isSendStatusChangeMail: true,
    isSendStatusChangeMailToBde: true,
    isSendStatusChangeMailToBa: true,
    isSendStatusChangeMailToPreSalesAdmin: true,
    sendStatusChangeMailToOtherMemberIds: ""
};
