import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IHolidayList } from "../models/holiday";

export const responseData: IHolidayList = {
    records: [
        {
            id: 15,
            date: "2024-01-27",
            remark: "abc",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 749,
            date: "2024-01-31",
            remark: "fwef",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 16,
            date: "2024-01-26",
            remark: "Republic Day",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 1069,
            date: "2002-01-01",
            remark: "test",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 859,
            date: "2023-01-01",
            remark: "test",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 5,
            date: "2024-01-03",
            remark: "Test1",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 10,
            date: "2024-01-23",
            remark: "Test-2",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 858,
            date: "2023-12-27",
            remark: "Test 2023",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 11,
            date: "2024-01-24",
            remark: "Test-3",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        },
        {
            id: 12,
            date: "2024-01-25",
            remark: "Test-4",
            isPublicHoliday: true,
            holidayType: "Public Holiday"
        }
    ],
    totalRecords: 16
};

export const holidayData = {
    name: 'nk',
    date: '2024-01-31'
};

export const weekOffData = {
    year: 2024
};

export const rowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
        id: 15,
        date: "2024-01-27",
        remark: "abc",
        isPublicHoliday: true,
        holidayType: "Public Holiday"
    }
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
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

export const addPublicHolidayData = {
    remark: "nk",
    date: "2024-01-31",
    isPublicHoliday: true
};

export const addHolidayData = {
    year: 2024
};
