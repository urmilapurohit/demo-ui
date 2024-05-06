import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DateField, DropDown, DropdownValue, InputType, TextField } from 'workspace-library';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DEFAULT_ORDER, DEFAULT_PAGINATION, PENDING_AT } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { AttendanceRegularizeStatus, DateFormats, Pages, PendingAt } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { ITeamList, ITeamObject, ITeamSearchParams } from '../../models/team.model';
import { TeamService } from '../../services/team.service';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  viewRequestType!: DropDown;
  status!: DropDown;
  statusList!: DropdownValue[];
  startDate!: DateField;
  endDate!: DateField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  teamGridConfig!: DataGrid<ITeamObject>;
  teamList: ITeamList | null = {} as ITeamList;
  initialSearchParams: ITeamSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    status: AttendanceRegularizeStatus.PENDING,
    viewRequestType: PendingAt.ASSIGN_TO_ME,
  };
  teamSearchParams: ITeamSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  tableColumns: any[] = [
    { field: "name", title: "Name" },
    { field: "attendanceDate", title: "Attendance Date", fieldDataType: DataGridFieldDataType.date },
    { field: "submittedAttendanceType", title: "Submitted Attendance" },
    { field: "correctedAttendanceType", title: "Correction To Be Done", },
    { field: "attendanceRegularizationStatus", title: "status" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: TeamService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private uiService: UIService,
    private regularizeService: RegularizeService,
    private permissionService: PermissionService,
  ) {
    this.teamSearchParams = {
      ...this.teamSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.teamSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.TeamRegularization);
  }

  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getTeamList();
    this.setTableConfig();
    this.setBreadcrumb();
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
      { label: 'Team', link: '' }
    ];
  }

  private getTeamList() {
    this.isGridLoading = true;

    const data = {
      ...this.teamSearchParams
    };

    this.service.getTeam(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITeamList>) => {
        if (res.isSuccess && res.data) {
          this.teamList = res.data;
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

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      status: 1,
      viewRequestType: 3
    });
    this.teamSearchParams = {
      ...this.teamSearchParams,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD)
    };
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name',
      formControlName: 'searchName',
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
    this.viewRequestType = {
      data: {
        data: PENDING_AT,
      },
      feature: {
        allowMultiple: false
      },
      id: 'viewRequestType',
      formControlName: 'viewRequestType',
      label: 'View Request Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.teamGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ITeamObject> => {
    const config: DataGrid<ITeamObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.teamSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.teamSearchParams.pageSize,
      totalDataLength: this.teamList?.totalRecords || 0,
      isNoRecordFound: !((this.teamList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.teamSearchParams = {
          ...this.teamSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getTeamList();
      },
      gridData: {
        data: this.teamList?.records,
        dataSource: undefined
      },
      id: 'TeamGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.teamSearchParams.pageNumber,
        pageSize: this.teamSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.teamSearchParams = {
            ...this.teamSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getTeamList();
        }
      }
    };
    return config;
  };

  private getStatusList(): void {
    this.uiService.getDropdownOptions(this.service.getTeamStatus(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.statusList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private getActionButtons(): DataGridActionButton<ITeamObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission && (this.filterForm.get('status')?.value === 1 || this.filterForm.get('status')?.value === 2 || this.filterForm.get('status')?.value === 4)) {
      const editButton: DataGridActionButton<ITeamObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ITeamObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.EDIT_TEAM_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    else {
      const viewButton: DataGridActionButton<ITeamObject> = this.regularizeService.getViewActionButtonConfig((data: DataGridFullRowData<ITeamObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.EDIT_TEAM_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(viewButton);
    }
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      status: AttendanceRegularizeStatus.PENDING,
      viewRequestType: PendingAt.ASSIGN_TO_ME,
    });
    this.teamSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD),
      sortDirection: 'asc'
    };
    this.getTeamList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.teamSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      status: this.filterForm.get('status')?.value,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      viewRequestType: this.filterForm.get('viewRequestType')?.value,
    };
    this.getTeamList();
  }

  // #endregion
}
