import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IDocumentCategoryList } from "../models/document.category";

export const responseData: IDocumentCategoryList = {
    records: [
        {
            id: 15,
            name: "Employee Newsletter",
            documents: []
        },
        {
            id: 1,
            name: "Holidays",
            documents: []
        },
        {
            id: 3,
            name: "HR Policies",
            documents: []
        },
        {
            id: 5,
            name: "KRA - QA",
            documents: []
        },
        {
            id: 4,
            name: "KRA - Technical",
            documents: []
        },
        {
            id: 6,
            name: "KRA - UX",
            documents: []
        },
        {
            id: 16,
            name: "Learning and Development",
            documents: []
        },
        {
            id: 24,
            name: "Leave Policy",
            documents: []
        },
        {
            id: 8,
            name: "Other Updates",
            documents: []
        },
        {
            id: 2,
            name: "Technical Standards",
            documents: []
        }
    ],
    totalRecords: 10
};

export const documentCategoryData = {
    name: 'Employee Newsletter',
    documents: []
};

export const rowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 15,
        name: "Employee Newsletter",
        documents: []
    }
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name',
    pageSize: 10
};

export const sortParam = {
    sortColumn: 'Name',
    search: '',
    sortBy: 'Name',
    sortDirection: 'asc'
};
