import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGridActionButton, DataGridFullRowData, InputType, TextField, DataGrid, DropDown, GlobalService, DropdownValue } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { INotificationList, INotificationObject, INotificationSearchParams } from '../../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  name!: TextField;
  status!: DropDown;
  notificationTypeList!: DropdownValue[];
  notificationTypeId!: string;
  notificationType!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: INotificationSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Title',
  };
  notificationsGridConfig!: DataGrid<INotificationObject>;
  notificationsList: INotificationList | null = {} as INotificationList;
  notificationsSearchParams: INotificationSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "notificationTypeName", title: "Notification Type", customHeaderClassName: 'notificationtype-column' },
    { field: "title", title: "Title", customHeaderClassName: 'title-column' },
    { field: "description", title: "Description", customHeaderClassName: '', showAsHtmlElement: true },
    { field: "priorityName", title: "Priority", customHeaderClassName: 'priority-column' },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: NotificationService,
    private router: Router,
    private uiService: UIService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private permissionService: PermissionService,
  ) {
    this.notificationTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.notificationsSearchParams = {
      ...this.notificationsSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.notificationsSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NotificationTypeDetail);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.getNotificationTypeOptions();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getNotificationList();
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
      { label: 'Notification', link: '' }
    ];
  }

  addNotification(): void {
    this.router.navigate([ROUTES.ADMIN.NOTIFICATION.ADD_NOTIFICATION_ABSOLUTE]);
  }

  private getNotificationTypeOptions() {
    this.uiService.getDropdownOptions(this.service.getNotificationTypeDropdown(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.notificationTypeList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      title: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE],
      notificationTypeId: 0,
    });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Title/Description',
      formControlName: 'title',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.notificationType = {
      data: {
        data: this.notificationTypeList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'notificationType',
      formControlName: 'notificationTypeId',
      label: 'Notification Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
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
    this.notificationsGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<INotificationObject> => {
    const config: DataGrid<INotificationObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.notificationsSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.notificationsSearchParams.pageSize,
      totalDataLength: this.notificationsList?.totalRecords || 0,
      isNoRecordFound: !((this.notificationsList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.notificationsSearchParams = {
          ...this.notificationsSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getNotificationList();
      },
      gridData: {
        data: this.notificationsList?.records,
        dataSource: undefined
      },
      id: 'NotificationTypeDetailGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'title' },
        pageNumber: this.notificationsSearchParams.pageNumber,
        pageSize: this.notificationsSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.notificationsSearchParams = {
            ...this.notificationsSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getNotificationList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<INotificationObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<INotificationObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<INotificationObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.NOTIFICATION.EDIT_NOTIFICATION_ABSOLUTE, data?.rowData?.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<INotificationObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private getNotificationList() {
    this.isGridLoading = true;
    const data = {
      ...this.notificationsSearchParams
    };
    this.service.getNotificationByTypeId(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INotificationList>) => {
        if (res.isSuccess && res.data) {
          this.notificationsList = res.data;
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
      title: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      notificationTypeId: 0,
    });
    this.notificationsSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getNotificationList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ title: this.filterForm.get('title')?.value.trim() });
    this.notificationsSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('title')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      notificationTypeId: this.filterForm.get('notificationTypeId')?.value,
    };
    this.getNotificationList();
  }

  private setPagination() {
    this.notificationsSearchParams = this.uiService.adjustPagination(this.notificationsList, this.notificationsSearchParams);
  }

  private changeStatus(id: number, status: boolean): void {
    this.service.updateNotificationStatus(id, !status).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<INotificationObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getNotificationList();
        }
      },
      error: () => { }
    });
  }

  private updateStatusConfirmation(id: number, status: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(id, status); });
  }
  // #endregion
}
