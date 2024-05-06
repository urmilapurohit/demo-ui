import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from '../../services/book.service';
import { IBookList, IBookObject, IBookSearchParams } from '../../models/book.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  bookCategory!: DropDown;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IBookSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    bookCategoryId: 0,
    sortBy: 'Name',
    isActive: true
  };
  bookGridConfig!: DataGrid<IBookObject>;
  bookList: IBookList | null = {} as IBookList;
  bookSearchParams: IBookSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  bookCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "bookCategoryName", title: "Category", customHeaderClassName: "category-column" },
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "author", title: "Author", customHeaderClassName: "author-column" },
    { field: "description", title: "Description", customHeaderClassName: "desc-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: BookService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.bookSearchParams = {
      ...this.bookSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.bookSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Book);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.getBookCategoryList();
    this.setTableConfig();
    this.getBookList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Book', link: '' },
    ];
  }

  addBook(): void {
    this.router.navigate([ROUTES.ADMIN.BOOK.ADD_BOOK_ABSOLUTE]);
  }

  private getBookCategoryList() {
    this.uiService.getDropdownOptions(this.service.getBookCategories(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.bookCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      bookCategory: 0,
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.bookCategory = {
      data: {
        data: this.bookCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'bookCategory',
      formControlName: 'bookCategory',
      label: 'Book Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.bookGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IBookObject> => {
    const config: DataGrid<IBookObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.bookSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.bookSearchParams.pageSize,
      totalDataLength: this.bookList?.totalRecords || 0,
      isNoRecordFound: !((this.bookList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.bookSearchParams = {
          ...this.bookSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getBookList();
      },
      gridData: {
        data: this.bookList?.records,
        dataSource: undefined
      },
      id: 'BookGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.bookSearchParams.pageNumber,
        pageSize: this.bookSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.bookSearchParams = {
            ...this.bookSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getBookList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IBookObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IBookObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IBookObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.BOOK.EDIT_BOOK_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IBookObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.bookSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      bookCategoryId: this.filterForm.get('bookCategory')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getBookList();
  }

  private getBookList() {
    this.isGridLoading = true;
    const data = {
      ...this.bookSearchParams
    };

    this.service.getBooks(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IBookList>) => {
        if (res.isSuccess && res.data) {
          this.bookList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      bookCategory: 0,
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.bookSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getBookList();
  }

  private setPagination() {
    this.bookSearchParams = this.uiService.adjustPagination(this.bookList, this.bookSearchParams);
  }

  private changeStatus(bookId: number, isActive: boolean): void {
    this.service.updateStatus(bookId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IBookObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getBookList();
        }
      }
    });
  }

  private updateStatusConfirmation(bookId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(bookId, isActive); });
  }
  // #endregion
}
