import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";

export const testResponse = {
    records: [
        {
            id: 1,
            name: "Laptop",
            description: "test data",
            isActive: true,
            isSerialRequired: true
        },
        {
            id: 2,
            name: "HardDisk",
            description: "test data",
            isActive: true,
            isSerialRequired: true
        },
        {
            id: 3,
            name: "Monitor",
            description: "aa",
            isActive: true,
            isSerialRequired: true
        },
    ],
    totalRecords: 3
};

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 13,
        name: 'Monitor',
        description: 'abc',
        isActive: true,
        isSerialRequired: true
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
    sortDirection: 'ascending'
};

export const testItemTypeData = {
    name: "Test Name",
    description: "description added",
    isActive: true,
    isSerialRequired: true
};
