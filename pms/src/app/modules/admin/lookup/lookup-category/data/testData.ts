import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";
import { ILookupCategoryList } from "../models/lookup.category";

export const testResponce: ILookupCategoryList = {
    records: [
        {
            id: 4,
            name: "Aa",
            isEditable: true
        },
        {
            id: 12,
            name: "ABC",
            isEditable: true
        },
        {
            id: 13,
            name: "B1_Test",
            isEditable: true
        },
        {
            id: 14,
            name: "B2_Test",
            isEditable: true
        },
        {
            id: 15,
            name: "B3_Test",
            isEditable: true
        },
        {
            id: 16,
            name: "B4_Test",
            isEditable: true
        },
        {
            id: 17,
            name: "B5_Test",
            isEditable: true
        },
        {
            id: 11,
            name: "B_Test",
            isEditable: true
        }
    ],
    totalRecords: 20,
};
export const testOptionData = [
    { id: 1, text: 'Lookup Category 1' },
    { id: 2, text: 'Lookup Category 2' }
];

export const testLookupCategoryData = {
    name: 'Test Book',
    status: 'Active',
    bookCategoryId: 22,
    author: "NA",
    description: "test data"
};

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 4,
        name: "Aa",
        isEditable: true
    }
};

export const testSearchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    isEditable: true,
    sortBy: 'Name',
    pageSize: 10
};

export const testSortParam = {
    sortColumn: 'Name',
    search: '',
    isEditable: true,
    sortBy: 'Name',
    sortDirection: 'asc'
};
