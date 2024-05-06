import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { ITechnicalSkillList } from "../models/technical.skill";

export const responseData: ITechnicalSkillList = {
    records: [
        {
            id: 2,
            name: "Communication",
            abbreviation: "Soft",
            isActive: true
        },
        {
            id: 6,
            name: ".net",
            abbreviation: "skill",
            isActive: true
        },
        {
            id: 3,
            name: "Problem Solving",
            abbreviation: "Analytical",
            isActive: true
        }
    ],
    totalRecords: 3
};

export const technicalSkillData = {
    name: 'Communication',
    status: 'Active',
    abbreviation: 'Soft'
};

export const addTechnicalSkillData = {
    name: 'Communication',
    abbreviation: 'Soft'
};

export const rowData = {
    currentPageNumber: 1,
    currentPageSize: 20,
    currentRowIndex: 1,
    rowData: {
        id: 2,
        name: "Communication",
        abbreviation: "Soft",
        isActive: true
    }
};

export const searchParam = {
    ...DEFAULT_PAGINATION,
    search: '',
    bookCategoryId: 0,
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
