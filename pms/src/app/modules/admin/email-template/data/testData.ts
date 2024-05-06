import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IEmailTemplateList } from "../models/email.template";

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 4,
        name: 'email template',
        subject: 'subject email',
        templateData: 'email body',
        token: 'token',
        isActive: true
    },
};

export const testSearchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const testSortParam = {
    sortColumn: 'Name',
    search: '',
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'asc'
};

export const testResponse: IEmailTemplateList = {
    records: [
        {
            id: 1,
            name: 'Test Email Template',
            subject: 'subject email',
            templateData: 'email body',
            token: 'token',
            isActive: true
        },
        {
            id: 2,
            name: 'Test Email Name',
            subject: 'subject of email',
            templateData: 'body',
            token: 'token',
            isActive: true
        }
    ],
    totalRecords: 10
};

export const testEditEmailTemplateData = {
    name: 'email template',
    subject: 'subject email',
    templateData: 'email body',
    token: 'token'
};

export const testEmailTemplateData = {
    name: 'Test Email Template',
    subject: 'subject email',
    templateData: 'email body',
    token: 'token',
    status: true
};
