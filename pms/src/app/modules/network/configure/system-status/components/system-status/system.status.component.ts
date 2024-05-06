import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TextField, DropDown, Button, DataGrid, GlobalService, InputType, DataGridActionButton, DataGridFullRowData, BaseResponseModel, DataGridFieldType } from 'workspace-library';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { Pages } from '@constants/Enums';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ISystemStatusList, ISystemStatusObject, ISystemStatusSearchParams } from '../../models/system.status';
import { SystemStatusService } from '../../services/system.status.service';

@Component({
  selector: 'app-system.status',
  templateUrl: './system.status.component.html',
  styleUrl: './system.status.component.css'
})
export class SystemStatusComponent implements OnInit, OnDestroy {
  // #region initialize variables
  name!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: ISystemStatusSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  systemStatusGridConfig!: DataGrid<ISystemStatusObject>;
  systemStatusList: ISystemStatusList | null = {} as ISystemStatusList;
  systemStatusSearchParams: ISystemStatusSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "system-status-name-col" },
    { field: "color", title: "Label Color", fieldType: DataGridFieldType.colorBox, isSortable: false },
    { field: "displayOrder", title: "Display Order" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: SystemStatusService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.systemStatusSearchParams = {
      ...this.systemStatusSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.systemStatusSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.SystemStatus);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.setTableConfig();
    this.getSystemStatusList();
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
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'System Status', link: '' },
    ];
  }

  addSystemStatus(): void {
    this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.ADD_SYSTEM_STATUS_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      name: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
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
    this.systemStatusGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ISystemStatusObject> => {
    const config: DataGrid<ISystemStatusObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.systemStatusSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.systemStatusSearchParams.pageSize,
      totalDataLength: this.systemStatusList?.totalRecords || 0,
      isNoRecordFound: !((this.systemStatusList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.systemStatusSearchParams = {
          ...this.systemStatusSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getSystemStatusList();
      },
      gridData: {
        data: this.systemStatusList?.records,
        dataSource: undefined
      },
      id: 'SystemStatusGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.systemStatusSearchParams.pageNumber,
        pageSize: this.systemStatusSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.systemStatusSearchParams = {
            ...this.systemStatusSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getSystemStatusList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ISystemStatusObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ISystemStatusObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISystemStatusObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.EDIT_SYSTEM_STATUS_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<ISystemStatusObject>) => {
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
    this.filterForm.patchValue({ name: this.filterForm.get('name')?.value.trim() });
    this.systemStatusSearchParams = {
      ...this.initialSearchParams,
      pageSize: DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('name')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getSystemStatusList();
  }

  private getSystemStatusList() {
    this.isGridLoading = true;
    const data = {
      ...this.systemStatusSearchParams
    };

    this.service.getSystemStatus(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISystemStatusList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.systemStatusList = res.data;
            this.setTableConfig();
          }
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
      name: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.systemStatusSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getSystemStatusList();
  }

  private setPagination() {
    this.systemStatusSearchParams = this.uiService.adjustPagination(this.systemStatusList, this.systemStatusSearchParams);
  }

  private changeStatus(systemStatusId: number, isActive: boolean): void {
    this.service.updateStatus(systemStatusId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ISystemStatusObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getSystemStatusList();
        }
      }
    });
  }

  private updateStatusConfirmation(systemStatusId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(systemStatusId, isActive); });
  }
  // #endregion
}
