import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IDocumentList } from "../models/document";

export const responseData: IDocumentList = {
    records: [
        {
            id: 1,
            documentCategoryId: 8,
            documentCategoryName: "Other Updates",
            title: "Other Doc 1",
            documentFileName: "sample-file.pdf",
            displayOrder: 1,
            isActive: true
        },
        {
            id: 3,
            documentCategoryId: 2,
            documentCategoryName: "Technical Standards",
            title: ".Net Coading standard",
            documentFileName: "dotnet-coading-standard.pdf",
            displayOrder: 1,
            isActive: true
        },
        {
            id: 4,
            documentCategoryId: 1,
            documentCategoryName: "Holidays",
            title: "string311",
            documentFileName: "demo.png",
            displayOrder: 1,
            isActive: true
        },
        {
            id: 5,
            documentCategoryId: 2,
            documentCategoryName: "Technical Standards",
            title: "Java Coding Standards",
            documentFileName: "java-coading-standard.pdf",
            displayOrder: 2,
            isActive: true
        },
        {
            id: 6,
            documentCategoryId: 2,
            documentCategoryName: "Technical Standards",
            title: "General Coding Standards",
            documentFileName: "general-coading-standard.pdf",
            displayOrder: 3,
            isActive: true
        },
        {
            id: 7,
            documentCategoryId: 2,
            documentCategoryName: "Technical Standards",
            title: "Tech Standards",
            documentFileName: "tech-standard.pdf",
            displayOrder: 4,
            isActive: true
        },
        {
            id: 8,
            documentCategoryId: 1,
            documentCategoryName: "Holidays",
            title: "demo123",
            documentFileName: "demo123.pdf",
            displayOrder: 2,
            isActive: true
        },
        {
            id: 9,
            documentCategoryId: 1,
            documentCategoryName: "Holidays",
            title: "test123",
            documentFileName: "test123.pdf",
            displayOrder: 3,
            isActive: true
        }
    ],
    totalRecords: 8
};

export const optionData = [
    { id: 1, text: 'Category 1' },
    { id: 2, text: 'Category 2' }
];

export const documentData = {
    title: 'Test Document',
    status: 'Active',
    documentCategoryId: 22,
    displayOrder: 1
};

export const addDocumentData = {
    title: 'Test Document - 1',
    documentCategory: '',
    displayOrder: 1
};

export const rowData = {
    currentPageNumber: 1,
    currentPageSize: 20,
    currentRowIndex: 1,
    rowData: {
        id: 1,
        documentCategoryId: 8,
        documentCategoryName: 'test',
        title: "Other Doc 1",
        documentFileName: "sample-file.pdf",
        displayOrder: 1,
        isActive: true
    }
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    documentCategoryId: 0,
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const sortParam = {
    sortColumn: 'Name',
    search: '',
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'asc'
};
