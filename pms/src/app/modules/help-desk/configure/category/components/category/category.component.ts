import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { Pages } from '@constants/Enums';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ICategoryList, ICategoryObject, ICategorySearchParams } from '../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit, OnDestroy {
  // #region class members
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  category!: DropDown;
  department!: DropDown;
  initialSearchParams: ICategorySearchParams = {
    ...DEFAULT_PAGINATION,
    departmentId: 0,
    categoryId: 0,
    sortBy: 'Name'
  };
  categoryGridConfig!: DataGrid<ICategoryObject>;
  categoryList: ICategoryList | null = {} as ICategoryList;
  categorySearchParams: ICategorySearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  categoryOptions!: DropdownValue[];
  departmentOptions!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  tableColumns: any[] = [
    { field: "name", title: "Name" },
    { field: "departmentName", title: "Department" },
    { field: "description", title: "Description" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: CategoryService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.categorySearchParams = {
      ...this.categorySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.categorySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.HelpDeskCategory);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTableConfig();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getDropDownItems();
    this.getCategoryList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Help Desk', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Category', link: '' }
    ];
  }

  addCategory(): void {
    this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.ADD_CATEGORY_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      department: 0,
      category: 0
    });
  }

  private getDropDownItems() {
    this.uiService.getDropdownOptions(this.service.getCategories(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.categoryOptions = data;
        this.setTextBoxConfig();
      }
    });
    this.uiService.getDropdownOptions(this.service.getDepartments(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.departmentOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private setTextBoxConfig = (): void => {
    this.category = {
      data: {
        data: this.categoryOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'category',
      formControlName: 'category',
      label: 'Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.department = {
      data: {
        data: this.departmentOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'department',
      formControlName: 'department',
      label: 'Department',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  getCategoryList() {
    this.isGridLoading = true;
    const data = {
      ...this.categorySearchParams
    };

    this.service.getCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ICategoryList>) => {
        if (res.isSuccess && res.data) {
          this.categoryList = res.data;
          this.setTableConfig();
        }
        setTimeout(() => {
          this.isGridLoading = false;
        }, 300);
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  setPagination() {
    this.categorySearchParams = this.uiService.adjustPagination(this.categoryList, this.categorySearchParams);
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.categoryGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ICategoryObject> => {
    const config: DataGrid<ICategoryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.categorySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.categorySearchParams.pageSize,
      totalDataLength: this.categoryList?.totalRecords || 0,
      isNoRecordFound: !((this.categoryList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.categorySearchParams = {
          ...this.categorySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getCategoryList();
      },
      gridData: {
        data: this.categoryList?.records,
        dataSource: undefined
      },
      id: 'CategoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.categorySearchParams.pageNumber,
        pageSize: this.categorySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.categorySearchParams = {
            ...this.categorySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getCategoryList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ICategoryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ICategoryObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ICategoryObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<ICategoryObject>) => {
        if (data?.rowData?.id) {
          this.deleteCategoryRequest(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      department: 0,
      category: 0
    });
    this.categorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getCategoryList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.categorySearchParams = {
      ...this.initialSearchParams,
      categoryId: this.filterForm.get('category')?.value,
      departmentId: this.filterForm.get('department')?.value,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber
    };
    this.getCategoryList();
  }

  private deleteCategoryRequest(id: number): void {
    this.uiService.openDeleteModel(() => { this.deleteCategory(id); });
  }

  private deleteCategory(categoryId: number): void {
    this.service.deleteCategory(categoryId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ICategoryObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getCategoryList();
        }
      }
    });
  }
  // #endregion
}
