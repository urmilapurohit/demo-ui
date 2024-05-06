import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IDepartmentList } from "../models/department";

export const testResponce: IDepartmentList = {
  records: [
    {
      id: 6,
      name: 'Accounts',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 14,
      name: 'Admin',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 4,
      name: 'Analysis',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 12,
      name: 'Android',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 3,
      name: 'Business Development',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 9,
      name: 'Design',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 7,
      name: 'E-Marketing',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 15,
      name: 'General',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 5,
      name: 'HR',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
    {
      id: 18,
      name: 'Internal Systems',
      isActive: true,
      departmentEmail: 'null',
      departmentEmailCc: 'null',
    },
  ],
  totalRecords: 20,
};
export const testDepartmentData = {
  name: 'Test Department',
  departmentEmail: 'test@example.com',
  departmentEmailCc: 'testcc@example.com',
  status: true
};
export const testRowData = {
  currentRowIndex: 0,
  currentPageSize: 3,
  currentPageNumber: 1,
  rowData: {
    id: 14,
    name: 'Admin',
    isActive: true,
    departmentEmail: 'null',
    departmentEmailCc: 'null',
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
export const testAddDepartmentData = {
  name: 'Test Department',
  departmentEmail: 'test@example.com',
  departmentEmailCc: 'testcc@example.com'
};
