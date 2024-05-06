import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";

export const testResponse = {
    records: [
        {
            id: 1,
            title: 'event one',
            startDate: '2024-02-07',
            endDate: '2024-02-12',
            newsEventFileName: 'file name',
            newsEventUniqueFileName: 'file unique name',
            isActive: true,
            createdOn: '2024-02-02',
            createdBy: 1,
            createdByName: 'admin'
        },
        {
            id: 2,
            title: 'event two',
            startDate: '2024-02-07',
            endDate: '2024-02-12',
            newsEventFileName: 'file name',
            newsEventUniqueFileName: 'file unique name',
            isActive: true,
            createdOn: '2024-02-02',
            createdBy: 1,
            createdByName: 'admin'
        },
        {
            id: 3,
            title: 'event',
            startDate: '2024-02-07',
            endDate: '2024-02-12',
            newsEventFileName: 'file name',
            newsEventUniqueFileName: 'file unique name',
            isActive: true,
            createdOn: '2024-02-02',
            createdBy: 3,
            createdByName: 'admin'
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
        title: 'event',
        startDate: '2024-02-07',
        endDate: '2024-02-12',
        newsEventFileName: 'file name',
        newsEventUniqueFileName: 'file unique name',
        isActive: true,
        createdOn: '2024-02-02',
        createdBy: 1,
        createdByName: 'admin'
    },
};

export const testSearchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    startDate: '',
    endDate: '',
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const testSortParam = {
    sortColumn: 'Name',
    search: '',
    startDate: '',
    endDate: '',
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'ascending'
};

export const testNewsEventData = {
    title: 'event',
    startDate: '2024-02-07',
    endDate: '2024-02-12',
    isActive: true
};
