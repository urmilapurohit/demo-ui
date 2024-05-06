import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";

export const testResponse = { records: [
    {
        id: 2,
        name: "Team Leader",
        abbreviation: "TL",
        canBeAssessor: false,
        canBeReviewer: false
    },
    {
        id: 2,
        name: "Team Leader",
        abbreviation: "TL",
        canBeAssessor: false,
        canBeReviewer: false
    },
    {
        id: 2,
        name: "Team Leader",
        abbreviation: "TL",
        canBeAssessor: false,
        canBeReviewer: false
    },
    {
        id: 2,
        name: "Team Leader",
        abbreviation: "TL",
        canBeAssessor: false,
        canBeReviewer: false
    },
    {
        id: 2,
        name: "Team Leader",
        abbreviation: "TL",
        canBeAssessor: false,
        canBeReviewer: false
    },
  ],
  totalRecords: 20,
};

export const testRowData = {
  currentRowIndex: 0,
  currentPageSize: 3,
  currentPageNumber: 1,
  rowData: {
    id: 14,
    name: 'test',
    abbreviation: 'test',
    canBeAssessor: true,
    canBeReviewer: true
  },
};
export const testSearchParam = {
  ...DEFAULT_PAGINATION,
  search: '',
  abbreviation: '',
  sortBy: 'Name',
  pageSize: 10
};

export const testSortParam = {
  sortColumn: 'Name',
  search: '',
  abbreviation: '',
  sortBy: 'Name',
  sortDirection: 'asc'
};
export const testDesignationData = {
  name: "Team Leader",
  abbreviation: "TL",
  canBeAssessor: true,
  canBeReviewer: true
};
