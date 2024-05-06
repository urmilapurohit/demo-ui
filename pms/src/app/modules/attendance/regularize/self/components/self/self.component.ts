import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGridActionButton, DataGridFullRowData, DataGrid, DataGridFieldDataType, DropDown, GlobalService, DateField, DropdownValue, ButtonType } from 'workspace-library';
import { Router } from '@angular/router';
import { COMMON_ICON, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { AttendanceRegularizeStatus, DateFormats, Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ISelfList, ISelfObject, ISelfSearchParams } from '../../models/self';
import { SelfService } from '../../services/self.service';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-self',
  templateUrl: './self.component.html',
  styleUrl: './self.component.css'
})

export class SelfComponent implements OnInit, OnDestroy {
  // #region initialize variables
  status!: DropDown;
  startDate!: DateField;
  endDate!: DateField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  selfGridConfig!: DataGrid<ISelfObject>;
  selfList: ISelfList | null = {} as ISelfList;
  initialSearchParams: ISelfSearchParams = {
    ...DEFAULT_PAGINATION,
    attendanceRegularizationStatusId: AttendanceRegularizeStatus.PENDING,
    sortBy: 'AttendanceDate',
  };
  selfSearchParams: ISelfSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  statusList!: DropdownValue[];
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  tableColumns: any[] = [
    { field: "attendanceDate", title: "Attendance Date", fieldDataType: DataGridFieldDataType.date },
    { field: "submittedAttendanceType", title: "Submitted Attendance" },
    { field: "correctedAttendanceType", title: "Correction To Be Done" },
    { field: "attendanceRegularizationStatus", title: "Status" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: SelfService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private regularizeService: RegularizeService,
    private permissionService: PermissionService
  ) {
    this.selfSearchParams = {
      ...this.selfSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.selfSearchParams.pageSize
    };

    this.pagePermissions = this.permissionService.checkAllPermission(Pages.SelfRegularization);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setDatePickerConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getSelfList();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.getStatusList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Regularize', link: '' },
      { label: 'Self', link: '' }
    ];
  }

  addSelf(): void {
    this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.ADD_SELF_ABSOLUTE]);
  }

  setPagination() {
    this.selfSearchParams = this.uiService.adjustPagination(this.selfList, this.selfSearchParams);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      attendanceRegularizationStatusId: AttendanceRegularizeStatus.PENDING
    });
    this.selfSearchParams = {
      ...this.selfSearchParams,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD)
    };
  }

  private getStatusList(): void {
    this.uiService.getDropdownOptions(this.service.getSelfStatus(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.statusList = data;
        this.setDropDownConfig();
      }
    });
  }

  private setDatePickerConfig = (): void => {
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: true,
      max: () => this.filterForm.get('endDate')?.value || this.today,
      isYearPicker: false,
      onEnterPress: () => { this.applyFilter(); }
    };
    this.endDate = {
      label: 'End Date',
      needOnKeyDown: true,
      formControlName: 'endDate',
      min: () => this.filterForm.get('startDate')?.value,
      max: () => this.today,
      isYearPicker: false,
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setDropDownConfig(): void {
    this.status = {
      data: {
        data: this.statusList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'status',
      formControlName: 'attendanceRegularizationStatusId',
      label: 'Status',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.selfGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ISelfObject> => {
    const config: DataGrid<ISelfObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.selfSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.selfSearchParams.pageSize,
      totalDataLength: this.selfList?.totalRecords || 0,
      isNoRecordFound: !((this.selfList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.selfSearchParams = {
          ...this.selfSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getSelfList();
      },
      gridData: {
        data: this.selfList?.records,
        dataSource: undefined
      },
      id: 'SelfGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'attendanceDate' },
        pageNumber: this.selfSearchParams.pageNumber,
        pageSize: this.selfSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.selfSearchParams = {
            ...this.selfSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getSelfList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ISelfObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission && this.filterForm.get('attendanceRegularizationStatusId')?.value !== 5 && this.filterForm.get('attendanceRegularizationStatusId')?.value !== 3) {
      const editButton: DataGridActionButton<ISelfObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISelfObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.EDIT_SELF_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      actionsButton.push(
        {
          btnImageSrc: COMMON_ICON.CANCEL_ICON,
          btnType: ButtonType.img,
          className: 'action-item table-icon-btn',
          tooltip: GLOBAL_CONSTANTS.CANCEL_ICON_TOOLTIP,
          callback: (data: DataGridFullRowData<ISelfObject>) => {
            if (data?.rowData?.id) {
              this.cancelSelfConfirmation(Number(data.rowData.id));
            }
          },
        },
      );
    }
    else {
      const viewButton: DataGridActionButton<ISelfObject> = this.regularizeService.getViewActionButtonConfig(
        (data: DataGridFullRowData<ISelfObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.EDIT_SELF_ABSOLUTE, data.rowData.id]);
          }
        },
      );
      actionsButton.push(viewButton);
    }
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      attendanceRegularizationStatusId: AttendanceRegularizeStatus.PENDING,
    });
    this.selfSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
    };
    this.getSelfList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.selfSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      attendanceRegularizationStatusId: this.filterForm.get('attendanceRegularizationStatusId')?.value ?? AttendanceRegularizeStatus.PENDING,
    };
    this.getSelfList();
  }

  private getSelfList() {
    this.isGridLoading = true;

    const data = {
      ...this.selfSearchParams
    };

    this.service.getSelf(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISelfList>) => {
        if (res.isSuccess && res.data) {
          this.selfList = res.data;
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

  private cancelSelf(id: number): void {
    this.service.cancelSelf(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ISelfObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getSelfList();
        }
      },
    });
  }

  private cancelSelfConfirmation(id: number): void {
    this.uiService.openConfirmationModal("Are you sure you want to cancel?", () => { this.cancelSelf(id); });
  }
  // #endregion
}
