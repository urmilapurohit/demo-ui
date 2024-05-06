import { DEFAULT_PAGINATION } from "@constants/constant";
import { IProjectGroupList } from "../models/group";

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
      id: 14,
      name: 'test',
      isActive: true,
      description: 'test',
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
    sortDirection: 'asc'
  };
  export const testResponse: IProjectGroupList = {
    records: [
      {
          id: 3,
          name: "Fixed",
          isActive: true,
          description: "T"
      },
      {
          id: 4,
          name: "Test1",
          isActive: true,
          description: "Test"
      },
      {
          id: 5,
          name: "Test12",
          isActive: true,
          description: "Test"
      },
      {
          id: 6,
          name: "Test2",
          isActive: true,
          description: "Test"
      },
      {
          id: 7,
          name: "Test3",
          isActive: true,
          description: "Test"
      },
      {
          id: 8,
          name: "BhavikDone",
          isActive: true,
          description: ""
      },
      {
          id: 10,
          name: "Group1",
          isActive: true,
          description: ""
      },
      {
          id: 11,
          name: "Project",
          isActive: true,
          description: "description"
      },
      {
          id: 12,
          name: "GroupTest",
          isActive: true,
          description: "Group"
      },
      {
          id: 14,
          name: "Chintan'Group",
          isActive: true,
          description: "Chintan's Test"
      }
  ],
    totalRecords: 17
  };
export const testProjectGroupData = {
  name: 'Test Project Group',
  isActive: true,
  description: 'Test Description'
};
