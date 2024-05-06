import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { StatusService } from '../../services/status.service';
import { IProjectStatusList, IProjectStatusObject, IProjectStatusSearchParams } from '../../models/status';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit, OnDestroy {
  // #region class Members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  projectStatusGridConfig!: DataGrid<IProjectStatusObject>;
  projectStatusList: IProjectStatusList | null = {} as IProjectStatusList;
  initialSearchParams: IProjectStatusSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  projectStatusSearchParams: IProjectStatusSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "displayOrder", title: "Display Order", fieldDataType: DataGridFieldDataType.number, customHeaderClassName: "order-column" },
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: StatusService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.projectStatusSearchParams = {
      ...this.projectStatusSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.projectStatusSearchParams.pageSize
    };

    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ProjectStatus);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getProjectStatusList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  getProjectStatusList() {
    this.isGridLoading = true;
    const data = {
      ...this.projectStatusSearchParams
    };

    this.service.getProjectStatus(data)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res: BaseResponseModel<IProjectStatusList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.projectStatusList = res.data;
            this.setTableConfig();
          }
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

  addProjectStatus(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.ADD_STATUS_ABSOLUTE]);
  }

  private setPagination() {
    this.projectStatusSearchParams = this.uiService.adjustPagination(this.projectStatusList, this.projectStatusSearchParams);
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Status ', link: '' },
    ];
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

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.projectStatusGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IProjectStatusObject> => {
    const config: DataGrid<IProjectStatusObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.projectStatusSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.projectStatusSearchParams.pageSize,
      totalDataLength: this.projectStatusList?.totalRecords || 0,
      isNoRecordFound: !((this.projectStatusList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.projectStatusSearchParams = {
          ...this.projectStatusSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getProjectStatusList();
      },
      gridData: {
        data: this.projectStatusList?.records,
        dataSource: undefined
      },
      id: 'StatusGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.projectStatusSearchParams.pageNumber,
        pageSize: this.projectStatusSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.projectStatusSearchParams = {
            ...this.projectStatusSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getProjectStatusList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IProjectStatusObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IProjectStatusObject> = this.uiService.getEditActionButtonConfig(
        (data: DataGridFullRowData<IProjectStatusObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.EDIT_STATUS_ABSOLUTE, data.rowData.id]);
          }
        },
        (data: IProjectStatusObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig(
        (data: DataGridFullRowData<IProjectStatusObject>) => {
          if (data?.rowData?.id) {
            this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
          }
        },
        (data: IProjectStatusObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.projectStatusSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getProjectStatusList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.projectStatusSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getProjectStatusList();
  }

  private changeStatus(statusId: number, isActive: boolean): void {
    this.service.updateStatus(statusId, !isActive)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (response: BaseResponseModel<IProjectStatusObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getProjectStatusList();
        }
      },
    });
  }

  private updateStatusConfirmation(statusId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(statusId, isActive); });
  }
  // #endregion
}
