import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";
import { ILookupCategoryDetailList } from "../models/lookup.category.detail";

export const responseData: ILookupCategoryDetailList = {
    records: [
        {
            id: 11,
            name: "aa",
            lookupCategoryId: 1,
            lookupCategoryName: "BhavinNew",
            description: "string",
            isActive: true,
            displayOrder: 0
        },
        {
            id: 18,
            name: "A_Test",
            lookupCategoryId: 3,
            lookupCategoryName: "BhavikSecond",
            description: "UI Test",
            isActive: true,
            displayOrder: 1
        },
        {
            id: 19,
            name: "B1_Test",
            lookupCategoryId: 11,
            lookupCategoryName: "B_Test",
            description: "UI Test",
            isActive: true,
            displayOrder: 1
        },
        {
            id: 16,
            name: "B2_Test",
            lookupCategoryId: 3,
            lookupCategoryName: "BhavikSecond",
            description: "UI Test",
            isActive: true,
            displayOrder: 3
        },
        {
            id: 17,
            name: "B3_Test",
            lookupCategoryId: 3,
            lookupCategoryName: "BhavikSecond",
            description: "UI Test - 1",
            isActive: true,
            displayOrder: 4
        },
        {
            id: 8,
            name: "BhavikSecondDeta",
            lookupCategoryId: 1,
            lookupCategoryName: "BhavinNew",
            description: "",
            isActive: true,
            displayOrder: 1
        }
    ],
    totalRecords: 20,
};

export const lookupCategoryDetailData = {
    name: 'Test Category',
    lookupCategoryId: 14,
    lookupCategoryName: 'B_Test',
    displayOrder: 1,
    description: 'test des',
};

export const rowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 11,
        name: "aa",
        lookupCategoryId: 1,
        lookupCategoryName: "BhavinNew",
        description: "string",
        isActive: true,
        displayOrder: 0
    }
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    lookupCategoryId: 0,
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const sortParam = {
    sortColumn: 'Name',
    search: '',
    lookupCategoryId: 0,
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'asc'
};

export const lookupCategoryData = [
    { id: 1, text: 'Category 1' },
    { id: 2, text: 'Category 2' }
];
