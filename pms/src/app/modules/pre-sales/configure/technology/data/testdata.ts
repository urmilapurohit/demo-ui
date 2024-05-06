import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";
import { ITechnologyList } from "../models/technology.model";

export const testResponce: ITechnologyList = {
    records: [
        {
            id: 6,
            name: 'Accounts',
            displayOrder: 1
        },
        {
            id: 14,
            name: 'Admin',
            displayOrder: 3
        },
        {
            id: 4,
            name: 'Analysis',
            displayOrder: 5
        },
        {
            id: 12,
            name: 'Android',
            displayOrder: 7
        },
        {
            id: 3,
            name: 'Business Development',
            displayOrder: 31
        },
        {
            id: 9,
            name: 'Design',
            displayOrder: 32
        },
        {
            id: 7,
            name: 'E-Marketing',
            displayOrder: 33
        }
    ],
    totalRecords: 20,
};
export const testTechnologyData = {
    name: 'Test Technology',
    displayOrder: 22,
};
export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 14,
        name: 'Admin',
        displayOrder: 22,
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
export const testAddTechnologyData = {
    name: 'Test Technology',
    displayOrder: 22
};
