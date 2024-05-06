import { DEFAULT_PAGINATION } from "../../../../common/constants/constant";
import { IBookList } from "../models/book.model";

export const responseData: IBookList = {
  records: [
    {
      id: 17,
      bookCategoryId: 3,
      bookCategoryName: "Team",
      name: "Book Final Test Done",
      author: "Dev",
      description: "UI Final Test Done Here",
      isActive: true
    },
    {
      id: 16,
      bookCategoryId: 1,
      bookCategoryName: "Biography",
      name: "B_Test",
      author: "NA",
      description: "UI Test",
      isActive: true
    },
    {
      id: 2,
      bookCategoryId: 3,
      bookCategoryName: "Team",
      name: "harry potter",
      author: "NA",
      description: "harry potter book",
      isActive: true
    },
    {
      id: 4,
      bookCategoryId: 3,
      bookCategoryName: "Team",
      name: "string",
      author: "string",
      description: "string",
      isActive: true
    },
    {
      id: 9,
      bookCategoryId: 6,
      bookCategoryName: "book category",
      name: "string",
      author: "string",
      description: "string",
      isActive: true
    },
    {
      id: 7,
      bookCategoryId: 9,
      bookCategoryName: "new1",
      name: "string 2",
      author: "string 2",
      description: "string 2",
      isActive: true
    },
    {
      id: 12,
      bookCategoryId: 2,
      bookCategoryName: "HRM test",
      name: "Test - 3",
      author: "B",
      description: "test",
      isActive: true
    },
    {
      id: 13,
      bookCategoryId: 2,
      bookCategoryName: "HRM test",
      name: "Test - 4",
      author: "B",
      description: "test",
      isActive: true
    },
    {
      id: 14,
      bookCategoryId: 2,
      bookCategoryName: "HRM test",
      name: "Test - 5",
      author: "B",
      description: "test",
      isActive: true
    },
    {
      id: 10,
      bookCategoryId: 2,
      bookCategoryName: "HRM test",
      name: "Test Book - 1",
      author: "B1",
      description: "Test by a person B1",
      isActive: true
    }
  ],
  totalRecords: 20,
};

export const optionData = [
  { id: 1, text: 'Category 1' },
  { id: 2, text: 'Category 2' }
];

export const bookData = {
  name: 'Test Book',
  status: 'Active',
  bookCategoryId: 22,
  author: "NA",
  description: "test data"
};

export const addBookData = {
  name: 'Test Book - 1',
  bookCategory: '',
  author: "NA",
  description: "test data"
};

export const rowData = {
  currentPageNumber: 1,
  currentPageSize: 20,
  currentRowIndex: 1,
  rowData: {
    id: 17,
    bookCategoryId: 3,
    bookCategoryName: "Team",
    name: "Book Final Test Done",
    author: "Dev",
    description: "UI Final Test Done Here",
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
