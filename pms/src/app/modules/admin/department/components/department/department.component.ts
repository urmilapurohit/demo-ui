import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGridActionButton, DataGridFullRowData, InputType, TextField, DataGrid, DataGridFieldType, DataGridFieldDataType, DropDown, GlobalService } from 'workspace-library';
import { Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { Pages } from '@constants/Enums';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { DepartmentService } from '../../services/department.service';
import { IDepartmentList, IDepartmentObject, IDepartmentSearchParams } from '../../models/department';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})

export class DepartmentComponent implements OnInit, OnDestroy {
  // #region class members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  departmentGridConfig!: DataGrid<IDepartmentObject>;
  departmentList: IDepartmentList | null = {} as IDepartmentList;
  initialSearchParams: IDepartmentSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  departmentSearchParams: IDepartmentSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: DepartmentService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.departmentSearchParams = {
      ...this.departmentSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.departmentSearchParams.pageSize
    };

    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Department);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getDepartmentList();
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
      { label: 'Admin', link: '' },
      { label: 'Department', link: '' }
    ];
  }

  setPagination() {
    this.departmentSearchParams = this.uiService.adjustPagination(this.departmentList, this.departmentSearchParams);
  }

  addDepartment(): void {
    this.router.navigate([ROUTES.ADMIN.DEPARTMENT.ADD_DEPARTMENT_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
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
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.departmentGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IDepartmentObject> => {
    const config: DataGrid<IDepartmentObject> = {
      actionButtons: this.getActionButtons(),
      columns: [
        {
          field: "name",
          title: "Name",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true
        }
      ],
      pageIndex: this.departmentSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.departmentSearchParams.pageSize,
      totalDataLength: this.departmentList?.totalRecords || 0,
      isNoRecordFound: !((this.departmentList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.departmentSearchParams = {
          ...this.departmentSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getDepartmentList();
      },
      gridData: {
        data: this.departmentList?.records,
        dataSource: undefined
      },
      id: 'DepartmentGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.departmentSearchParams.pageNumber,
        pageSize: this.departmentSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.departmentSearchParams = {
            ...this.departmentSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getDepartmentList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IDepartmentObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IDepartmentObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IDepartmentObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.DEPARTMENT.EDIT_DEPARTMENT_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IDepartmentObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private getDepartmentList() {
    this.isGridLoading = true;

    const data = {
      ...this.departmentSearchParams
    };

    this.service.getDepartments(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDepartmentList>) => {
        if (res.isSuccess && res.data) {
          this.departmentList = res.data;
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

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.departmentSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getDepartmentList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.departmentSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getDepartmentList();
  }

  private changeStatus(departmentId: number, isActive: boolean): void {
    this.service.updateStatus(departmentId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IDepartmentObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getDepartmentList();
        }
      }
    });
  }

  private updateStatusConfirmation(departmentId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(departmentId, isActive); });
  }
  // #endregion
}
