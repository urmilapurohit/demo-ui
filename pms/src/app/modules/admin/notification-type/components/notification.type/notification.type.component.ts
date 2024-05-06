import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGridActionButton, DataGridFullRowData, InputType, TextField, DataGrid, DropDown, GlobalService } from 'workspace-library';
import { Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { INotificationTypeList, INotificationTypeObject, INotificationTypeSearchParams } from '../../models/notification.type';
import { NotificationTypeService } from '../../services/notification.type.service';

@Component({
  selector: 'app-notification.type',
  templateUrl: './notification.type.component.html',
  styleUrl: './notification.type.component.css'
})
export class NotificationTypeComponent implements OnInit, OnDestroy {
  // #region initialize variables
  name!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: INotificationTypeSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name',
  };
  notificationTypeGridConfig!: DataGrid<INotificationTypeObject>;
  notificationTypeList: INotificationTypeList | null = {} as INotificationTypeList;
  notificationTypeSearchParams: INotificationTypeSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: '' },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: NotificationTypeService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.notificationTypeSearchParams = {
      ...this.notificationTypeSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.notificationTypeSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NotificationType);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getNotificationTypeList();
    this.setTableConfig();
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
      { label: 'Notification Type', link: '' }
    ];
  }

  addNotificationType(): void {
    this.router.navigate([ROUTES.ADMIN.NOTIFICATION_TYPE.ADD_NOTIFICATION_TYPE_ABSOLUTE]);
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
    this.notificationTypeGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<INotificationTypeObject> => {
    const config: DataGrid<INotificationTypeObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.notificationTypeSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.notificationTypeSearchParams.pageSize,
      totalDataLength: this.notificationTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.notificationTypeList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.notificationTypeSearchParams = {
          ...this.notificationTypeSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getNotificationTypeList();
      },
      gridData: {
        data: this.notificationTypeList?.records,
        dataSource: undefined
      },
      id: 'NotificationTypeGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.notificationTypeSearchParams.pageNumber,
        pageSize: this.notificationTypeSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.notificationTypeSearchParams = {
            ...this.notificationTypeSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getNotificationTypeList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<INotificationTypeObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<INotificationTypeObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<INotificationTypeObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.NOTIFICATION_TYPE.EDIT_NOTIFICATION_TYPE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<INotificationTypeObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private getNotificationTypeList() {
    this.isGridLoading = true;
    const data = {
      ...this.notificationTypeSearchParams
    };
    this.service.getNotificationType(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INotificationTypeList>) => {
        if (res.isSuccess && res.data) {
          this.notificationTypeList = res.data;
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
      name: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.notificationTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getNotificationTypeList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.notificationTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('name')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getNotificationTypeList();
  }

  private setPagination() {
    this.notificationTypeSearchParams = this.uiService.adjustPagination(this.notificationTypeList, this.notificationTypeSearchParams);
  }

  private changeStatus(notificationTypeId: number, status: boolean): void {
    this.service.updateNotificationTypeStatus(notificationTypeId, !status).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<INotificationTypeObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getNotificationTypeList();
        }
      }
    });
  }

  private updateStatusConfirmation(notificationTypeId: number, status: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(notificationTypeId, status); });
  }
  // #endregion
}
