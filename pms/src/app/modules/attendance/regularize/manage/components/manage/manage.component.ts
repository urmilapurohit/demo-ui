import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGridActionButton, DataGridFullRowData, DataGrid, DataGridFieldDataType, DropDown, DateField, TextField, InputType, DropdownValue } from 'workspace-library';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { DEFAULT_ORDER, DEFAULT_PAGINATION, } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { AttendanceRegularizeStatus, DateFormats, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { IManageList, IManageObject, IManageSearchParams } from '../../models/manage';
import { ManageService } from '../../services/manage.service';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})

export class ManageComponent implements OnInit, OnDestroy {
  // #region initialize variables
  name!: TextField;
  status!: DropDown;
  startDate!: DateField;
  endDate!: DateField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  manageGridConfig!: DataGrid<IManageObject>;
  manageList: IManageList | null = {} as IManageList;
  initialSearchParams: IManageSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    status: AttendanceRegularizeStatus.APPROVED
  };
  manageSearchParams: IManageSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  statusList: DropdownValue[] = [];
  resetSorting: boolean = false;
  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  tableColumns: any[] = [
    { field: "name", title: "Name" },
    { field: "attendanceDate", title: "Attendance Date", fieldDataType: DataGridFieldDataType.date },
    { field: "submittedAttendanceType", title: "Submitted Attendance" },
    { field: "correctedAttendanceType", title: "Correction To Be Done" },
    { field: "attendanceRegularizationStatus", title: "Status" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ManageService,
    private fb: FormBuilder,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService,
    private regularizeService: RegularizeService
  ) {
    this.manageSearchParams = {
      ...this.manageSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.manageSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.SelfRegularization);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setDatePickerConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getManageList();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.getStatusList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Regularize', link: '' },
      { label: 'Manage', link: '' }
    ];
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      search: [""],
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      status: AttendanceRegularizeStatus.APPROVED,
    });
    this.manageSearchParams = {
      ...this.manageSearchParams,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD)
    };
  }

  private setDatePickerConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'search',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: true,
      max: () => this.filterForm.get('endDate')?.value || this.today,
      isYearPicker: false,
      onEnterPress: () => { this.applyFilter(); },
    };
    this.endDate = {
      label: 'End Date',
      needOnKeyDown: true,
      formControlName: 'endDate',
      min: () => this.filterForm.get('startDate')?.value,
      max: () => this.today,
      isYearPicker: false,
      onEnterPress: () => { this.applyFilter(); },
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
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.applyFilter(); },
    };
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.manageGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<IManageObject> => {
    const config: DataGrid<IManageObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.manageSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.manageSearchParams.pageSize,
      totalDataLength: this.manageList?.totalRecords || 0,
      isNoRecordFound: !((this.manageList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.manageSearchParams = {
          ...this.manageSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getManageList();
      },
      gridData: {
        data: this.manageList?.records,
        dataSource: undefined
      },
      id: 'ManageGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.manageSearchParams.pageNumber,
        pageSize: this.manageSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.manageSearchParams = {
            ...this.manageSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getManageList();
        }
      }
    };
    return config;
  };

  private getStatusList(): void {
    this.uiService.getDropdownOptions(this.service.getManageStatus(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.statusList = data;
        this.setDropDownConfig();
      },
    });
  }

  private getActionButtons(): DataGridActionButton<IManageObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission && (this.filterForm.get('status')?.value === AttendanceRegularizeStatus.APPROVED)) {
      const editButton: DataGridActionButton<IManageObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IManageObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.MANAGE.EDIT_MANAGE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    else {
      const viewButton: DataGridActionButton<IManageObject> = this.regularizeService.getViewActionButtonConfig((data: DataGridFullRowData<IManageObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.MANAGE.EDIT_MANAGE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(viewButton);
    }
    return actionsButton;
  }

  private getManageList() {
    this.isGridLoading = true;

    const data = {
      ...this.manageSearchParams
    };

    this.service.getManage(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IManageList>) => {
        if (res.isSuccess && res.data) {
          this.manageList = res.data;
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
      search: '',
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      status: AttendanceRegularizeStatus.APPROVED,
    });
    this.manageSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD),
      sortDirection: 'asc'
    };
    this.getManageList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.manageSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('search')?.value,
      status: this.filterForm.get('status')?.value,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
    };
    this.getManageList();
  }
  // #endregion
}
