import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IBookCategoryList, IBookCategoryObject, IBookCategorySearchParams } from '../../models/book.category';
import { BookCategoryService } from '../../services/book.category.service';

@Component({
  selector: 'app-book.category',
  templateUrl: './book.category.component.html',
  styleUrl: './book.category.component.css'
})
export class BookCategoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IBookCategorySearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name'
  };
  bookCategoryGridConfig!: DataGrid<IBookCategoryObject>;
  bookCategoryList: IBookCategoryList | null = {} as IBookCategoryList;
  bookCategorySearchParams: IBookCategorySearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: BookCategoryService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.bookCategorySearchParams = {
      ...this.bookCategorySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.bookCategorySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.BookCategory);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getBookCategoryList();
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
      { label: 'Book Category', link: '' }
    ];
  }

  addBookCategory(): void {
    this.router.navigate([ROUTES.ADMIN.BOOK_CATEGORY.ADD_BOOK_CATEGORY_ABSOLUTE]);
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: ''
    });
    this.bookCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getBookCategoryList();
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""]
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
  };

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.bookCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value
    };
    this.getBookCategoryList();
  }

  private getBookCategoryList() {
    this.isGridLoading = true;
    const data = {
      ...this.bookCategorySearchParams
    };

    this.service.getBookCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IBookCategoryList>) => {
        if (res.isSuccess && res.data) {
          this.bookCategoryList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
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
    this.bookCategoryGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IBookCategoryObject> => {
    const config: DataGrid<IBookCategoryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.bookCategorySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.bookCategorySearchParams.pageSize,
      totalDataLength: this.bookCategoryList?.totalRecords || 0,
      isNoRecordFound: !((this.bookCategoryList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.bookCategorySearchParams = {
          ...this.bookCategorySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getBookCategoryList();
      },
      gridData: {
        data: this.bookCategoryList?.records,
        dataSource: undefined
      },
      id: 'bookCategoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.bookCategorySearchParams.pageNumber,
        pageSize: this.bookCategorySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.bookCategorySearchParams = {
            ...this.bookCategorySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getBookCategoryList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IBookCategoryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IBookCategoryObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IBookCategoryObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.BOOK_CATEGORY.EDIT_BOOK_CATEGORY_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<IBookCategoryObject>) => {
        if (data?.rowData?.id) {
          this.deleteBookCategoryConfirmation(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private setPagination() {
    this.bookCategorySearchParams = this.uiService.adjustPagination(this.bookCategoryList, this.bookCategorySearchParams);
  }

  private delete(bookCategoryId: number): void {
    this.service.deleteBookCategory(bookCategoryId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IBookCategoryObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getBookCategoryList();
        }
      }
    });
  }

  private deleteBookCategoryConfirmation(bookCategoryId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this book category?",
      () => {
        this.delete(bookCategoryId);
      }
    );
  }
  // #endregion
}
