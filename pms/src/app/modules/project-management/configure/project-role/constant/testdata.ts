import { DEFAULT_PAGINATION } from "@constants/constant";
import { IProjectRoleList } from "../models/project.role";

export const testResponse: IProjectRoleList = {
    records: [
      {
          id: 3,
          name: "Fixed",
          isActive: true,
          abbreviation: "string",
          isMemberIdRequired: true
      }
  ],
    totalRecords: 17
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
    sortDirection: 'asc'
  };
  export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
          id: 3,
          name: "Fixed",
          isActive: true,
          abbreviation: "string",
          isMemberIdRequired: true
    },
  };
export const testProjectRoleData = {
  id: 3,
  name: "Fixed",
  isActive: true,
  abbreviation: "string",
  isMemberIdRequired: true
};
