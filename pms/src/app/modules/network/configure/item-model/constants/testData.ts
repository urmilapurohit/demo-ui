import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";

export const testResponse = {
    records: [
        {
            id: 1,
            networkItemTypeId: 2,
            networkItemTypeName: 'HardDisk',
            name: '256GB',
            description: 'abc',
            isActive: true
        },
        {
            id: 2,
            networkItemTypeId: 3,
            networkItemTypeName: 'Monitor',
            name: 'LG',
            description: 'abcd',
            isActive: true
        },
        {
            id: 3,
            networkItemTypeId: 4,
            networkItemTypeName: 'HeadPhone',
            name: 'Circle',
            description: 'abcde',
            isActive: true
        },
    ],
    totalRecords: 3
};

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 8,
        networkItemTypeId: 1,
        networkItemTypeName: 'Laptop',
        name: 'HP 15',
        description: 'abc',
        isActive: true
    },
};

export const testSearchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    networkItemType: 0,
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const testItemModelData = {
    networkItemTypeId: 1,
    networkItemTypeName: "Abc",
    name: "model name",
    description: "test description",
    isActive: true
};

export const testSortParam = {
    sortColumn: 'Name',
    search: '',
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'ascending'
};
