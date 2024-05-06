import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IBookCategoryList } from "../models/book.category";

export const responseData: IBookCategoryList = {
    records: [
        {
            id: 1,
            name: "Biography"
        },
        {
            id: 6,
            name: "book category"
        },
        {
            id: 15,
            name: "Documents"
        },
        {
            id: 16,
            name: "History"
        },
        {
            id: 2,
            name: "HRM test"
        },
        {
            id: 9,
            name: "new1"
        },
        {
            id: 14,
            name: "Novel"
        },
        {
            id: 3,
            name: "Team"
        }
    ],
    totalRecords: 8
};

export const bookCategoryData = {
    name: 'book category'
};

export const rowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 6,
        name: "book category"
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
