import { DEFAULT_PAGINATION } from "../../../../../common/constants/constant";
import { IVendorList } from "../models/vendor";

export const responseData: IVendorList = {
    records: [
        {
            id: 1,
            name: "string",
            phoneNo: 8523697412,
            address: "string",
            comments: "string",
            isActive: true
        },
        {
            id: 5,
            name: "string",
            phoneNo: 9409568586,
            address: "string",
            comments: "string",
            isActive: true
        },
        {
            id: 2,
            name: "string 2",
            phoneNo: 7523697412,
            address: "string",
            comments: "string",
            isActive: true
        },
        {
            id: 3,
            name: "string 2",
            phoneNo: 6523697417,
            address: "string",
            comments: "string",
            isActive: true
        },
        {
            id: 4,
            name: "string5",
            phoneNo: 923697412,
            address: "string",
            comments: "string",
            isActive: true
        }
    ],
    totalRecords: 5,
};

export const vendorData = {
    name: 'KFC',
    status: 'Active',
    phoneNumber: '',
    address: 'san francisco',
};

export const addVendorData = {
    name: 'KFC',
    phoneNumber: '',
    address: 'san francisco',
    comments: 'test'
};

export const rowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 1,
        name: "string",
        phoneNo: 8523697412,
        address: "string",
        comments: "string",
        isActive: true
    },
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    phoneNumber: 0,
    isActive: true,
    sortBy: 'Name',
    pageSize: 10
};

export const sortParam = {
    sortColumn: 'Name',
    search: '',
    phoneNumber: 0,
    isActive: true,
    sortBy: 'Name',
    sortDirection: 'asc'
};
