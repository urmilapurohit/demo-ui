import { DEFAULT_PAGINATION } from "@constants/constant";
import { IProjectTypeList } from "../models/type";

export const testRowData = {
    currentRowIndex: 0,
    currentPageSize: 3,
    currentPageNumber: 1,
    rowData: {
      id: 14,
      name: 'test',
      isActive: true,
      isDefault: true,
    displayOrder: 1
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
  export const testResponse: IProjectTypeList = {
          records: [
            {
              id: 1,
              name: "Fixed cost",
              isActive: true,
              isDefault: true,
              displayOrder: 1
            },
            {
              id: 2,
              name: "Hourly",
              isActive: true,
              isDefault: true,
              displayOrder: 2
            },
            {
              id: 3,
              name: "Monthly",
              isActive: true,
              isDefault: true,
              displayOrder: 3
            }
          ],
          totalRecords: 3
  };
export const testProjectTypeData = {
  name: 'Test Project Type',
  isActive: true,
  displayOrder: 1
};
