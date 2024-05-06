import { Component, ViewChild, ViewChildren, QueryList, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, Checkbox, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFieldType, DataGridFullRowData, DateField, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { MatSelectChange } from '@angular/material/select';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GeneralService } from '@services/general.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ALLOCATION_TYPE, DEFAULT_PAGINATION, EMPLOYEE_STATUS, EMPLOYEE_WORK_STATUS, TYPE } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { DateFormats, Pages } from '@constants/Enums';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '@services/permission.service';
import { ProjectDetail, IResourceManageList, IResourceSearchParams, IUserObject, User } from '../../models/manage';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})

export class ManageComponent implements OnInit, OnDestroy {
  // #region initialize variables
  @ViewChild('reportingManagerDropDown') reportingManagerDropDown: TemplateRef<any> | undefined;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<ProjectDetail>>;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  startDate!: DateField;
  endDate!: DateField;
  yearDropDown!: DropDown;
  monthDropDown!: DropDown;
  designation!: DropDown;
  department!: DropDown;
  employeeWorkStatus!: DropDown;
  projectNature!: DropDown;
  allocationType!: DropDown;
  employeeName!: TextField;
  employeeStatus!: DropDown;
  excludeResignedEmployee!: Checkbox;
  nonBilledOnly!: Checkbox;
  isDaily: boolean = false;
  isMonthly: boolean = false;
  isWeekly: boolean = false;
  type!: DropDown;
  pm_tl!: DropDown;
  technicalSkillDropdownConfig!: DropDown;
  technicalSkillDropdownOptions: DropdownValue[] = [];
  monthOptions: DropdownValue[] = [];
  yearOptions: DropdownValue[] = [];
  initialSearchParams: IResourceSearchParams = {
    ...DEFAULT_PAGINATION,
    sortBy: 'FullName',
    sortDirection: 'ascending',
    memberStatusId: 1
  };
  resourceSearchParams: IResourceSearchParams = { ...this.initialSearchParams };
  reportingMemberDropdown!: DropDown;
  reportingMemberDropdownOptions!: DropdownValue[];
  filterForm!: FormGroup;
  manageTeamForm!: FormGroup;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  submitted: boolean = false;
  designationOptions!: DropdownValue[];
  departmentOptions!: DropdownValue[];
  pm_tlOptions!: DropdownValue[];
  employeeStatusOptions!: DropdownValue[];
  projectNatureOptions!: DropdownValue[];
  breadcrumbItems!: BreadcrumbItem[];
  isDropDown: boolean = false;
  reportingMemberId: number = 0;
  resourceManageGridConfig!: DataGrid<IUserObject>;
  resourceManageList: IResourceManageList = {} as IResourceManageList;
  pagePermissions: PageAccessPermission;
  expandedElementId?: number = 0;
  dataSource!: MatTableDataSource<User>;
  usersData: User[] = [];
  expandedElement: User | null = null;
  tableColumns: any[] = [
    { field: "fullName", title: "Name", customHeaderClassName: "name-column" },
    { field: "department", title: "Department", customHeaderClassName: "dept-name-column" },
    { field: "designation", title: "Designation", customHeaderClassName: "designation-column" },
    { field: "totalExp", title: "Experience", customHeaderClassName: "experience-column" },
    { field: "workStatus", title: "Work Status", customHeaderClassName: "workstatus-column" },
    { field: "totalAllottedHours", title: "Total Hrs", customHeaderClassName: "total-hrs-column" },
    { field: "releaseDate", title: "Release Date", fieldDataType: DataGridFieldDataType.date, customHeaderClassName: "release-date-column" },
    { field: "noOfProjects", title: "No Of Project", customHeaderClassName: "no-of-projects-column" },
  ];
  nestedTableColumns: any[] = [
    { field: "projectName", title: "Project", isSortable: false },
    { field: "pmLeadName", title: "PM/TL", isSortable: false },
    { field: "startDate", title: "Start Date", isSortable: false, fieldDataType: DataGridFieldDataType.date, },
    { field: "endDate", title: "End Date", isSortable: false, fieldDataType: DataGridFieldDataType.date, },
    { field: "allottedHours", title: "Allotted Hours", isSortable: false },
    { field: "workStatus", title: "Work Status", isSortable: false },
    { field: "billable", title: "Billable", isSortable: false },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private uiService: UIService,
    private fb: FormBuilder,
    private router: Router,
    private service: ManageService,
    private generalService: GeneralService,
    private globalService: GlobalService,
    public dialog: MatDialog,
    private permissionService: PermissionService
  ) {
    this.resourceSearchParams = {
      ...this.resourceSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.resourceSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ResourceManagementManage);
    this.monthOptions = this.uiService.getMonths();
    this.monthOptions.unshift({ id: '', text: 'Select Month' });
    this.yearOptions = this.uiService.getFourYearsFromNow();
    this.yearOptions.unshift({ id: '', text: 'Select Year' });
  }
  // #endregion

  ngOnInit() {
    this.initializeForm();
    this.setButtonConfig();
    this.getResourceManagementList();
    this.setTableConfig();
    this.setDropDownConfig();
    this.getDropDownItems();
    this.setBreadcrumb();
    this.setCheckBoxConfig();
    this.setDatePickerConfig();
    this.getReportingMembers();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  openDropDown(rowData: IUserObject) {
    this.manageTeamForm.removeControl('reportingToMember');
    this.manageTeamForm.addControl('reportingToMember', new FormControl({ value: rowData.reportingToMemberId, disabled: false }));
    this.reportingMemberId = rowData.id;
    this.isDropDown = true;
    this.reportingMemberDropdown = {
      data: {
        data: this.reportingMemberDropdownOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      id: 'reportingToMember',
      formControlName: 'reportingToMember',
      label: '',
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: (event) => { this.onReportingMemberChange(rowData.id, event); }
    };
  }

  closeDropDown() {
    this.manageTeamForm.removeControl('reportingToMember');
    this.isDropDown = false;
    this.reportingMemberId = 0;
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Resource Management', link: '' },
      { label: 'Manage', link: '' },
    ];
  }

  private onReportingMemberChange = (
    id: number,
    data: MatSelectChange
  ): void => {
    const reportingToMemberId = data.value;
    this.service.updateReportingToMember(Number(id), reportingToMemberId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.getResourceManagementList();
            this.manageTeamForm.removeControl('reportingToMember');
            this.isDropDown = false;
            this.reportingMemberId = 0;
          }
        },
      });
  };

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      search: '',
      workStatus: '',
      projectNatureId: 0,
      allocationTypeId: 0,
      memberStatusId: 1,
      designationIds: [],
      departmentIds: [],
      startDate: '',
      endDate: '',
      type: 0,
      month: '',
      year: '',
      nonBillableOnly: false,
      excludeResignedMembers: false,
      pmLeadId: 0,
      technicalSkillIds: []
    });

    this.manageTeamForm = this.fb?.group({});
  }

  private setDatePickerConfig = (): void => {
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: true,
      isRequired: this.isWeekly,
      max: () => this.filterForm.get('endDate')?.value,
      isYearPicker: false
    };
    this.endDate = {
      label: 'End Date',
      needOnKeyDown: true,
      formControlName: 'endDate',
      min: () => this.filterForm.get('startDate')?.value,
      isRequired: this.isWeekly,
      isYearPicker: false
    };
    this.yearDropDown = {
      data: {
        data: this.yearOptions
      },
      feature: {
        allowMultiple: false
      },
      id: 'yearDropdown',
      formControlName: 'year',
      label: 'Year',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { },
      isRequired: this.isMonthly,
    };
    this.monthDropDown = {
      data: {
        data: this.monthOptions
      },
      feature: {
        allowMultiple: false
      },
      id: 'monthDropdown',
      formControlName: 'month',
      label: 'Month',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { },
      isRequired: this.isMonthly,
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setCheckBoxConfig(): void {
    this.excludeResignedEmployee = this.uiService.getCheckBoxConfig('Exclude Resigned Employees', 'excludeResignedMembers');
    this.nonBilledOnly = this.uiService.getCheckBoxConfig('Non Billed Only', 'nonBillableOnly');
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    setTimeout(() => {
      this.isGridLoading = false;
    }, 300);
    this.resourceManageGridConfig = this.getGridConfig();
  }

  private nestedActionButtonCallBack(data: DataGridFullRowData<IUserObject>) {
    if (data?.rowData?.id && !data.rowData.isExpanded) {
      const param = {
        memberId: data.rowData.id,
        startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : null,
        endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : null,
        projectNatureId: this.filterForm.get('projectNatureId')?.value > 0 ? this.filterForm.get('projectNatureId')?.value : null,
        allocationTypeId: this.filterForm.get('allocationTypeId')?.value > 0 ? this.filterForm.get('allocationTypeId')?.value : null,
        nonBillableOnly: this.filterForm.get('nonBillableOnly')?.value,
      };
      this.service.getProjectDetails(param)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<ProjectDetail[]>) => {
            if (res.isSuccess && res.data) {
              const expandedResource = this.resourceManageList.records.find((x) => x.id === data?.rowData?.id);
              if (expandedResource && !expandedResource.isExpanded) {
                expandedResource.isExpanded = true;
                this.expandedElementId = data?.rowData?.id;
                expandedResource.nestedGridConfig = this.getNestedGridConfig(res.data);
              }
              else {
                this.expandedElementId = undefined;
              }
            }
          },
        });
    }
    else {
      this.expandedElementId = undefined;
    }
    this.resourceManageList.records.forEach((x) => {
      if (x.id !== this.expandedElementId) {
        x.isExpanded = false;
        x.nestedGridConfig = undefined;
      }
    });
    this.setTableConfig();
  }

  private getNestedActionButtons(): DataGridActionButton<IUserObject>[] {
    const actionsButton = [];
    actionsButton.push(
      {
        btnImageSrc: 'assets/images/plus-icon-gray.svg',
        btnAlternateSrc: 'assets/images/minus-icon-gray.svg',
        btnType: ButtonType.img,
        tooltip: 'Collapse',
        isBooleanBtn: true,
        booleanField: 'isExpanded',
        alterTooltip: 'Expand',
        className: 'action-item table-icon-btn',
        callback: (data: DataGridFullRowData<IUserObject>) => {
          this.nestedActionButtonCallBack(data);
        },
        visibleCallback: (data: IUserObject) => {
          return (data.noOfProjects > 0);
        }
      }
    );
    return actionsButton;
  }

  private getNestedGridConfig(ProjectDetailData: ProjectDetail[]): DataGrid<ProjectDetail> {
    const config: DataGrid<ProjectDetail> = {
      nestedGrid: {
        isChildTable: true,
      },
      columns: this.setNestedTableColumns(),
      gridData: {
        data: ProjectDetailData,
        dataSource: undefined,
      },
      id: 'projectDetailsGrid',
      idFieldKey: 'projectName',
      displayIndexNumber: true,
      indexColumnHeaderName: "No.",
      features: {
        hidePagination: true,
      },
      pageIndex: 1
    };
    return config;
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    columnData.push(
      {
        field: "reportingToMember",
        title: "Report To",
        fieldDataType: DataGridFieldDataType.CustomRenderTemplate,
        fieldType: DataGridFieldType.data,
        isSortable: false,
        customRenderTemplate: this.reportingManagerDropDown,
        customHeaderClassName: "ro-name-column"
      }
    );
    return columnData;
  }

  private setNestedTableColumns() {
    const columnData: any[] = [];
    this.nestedTableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig(): DataGrid<IUserObject> {
    const config: DataGrid<IUserObject> = {
      columns: this.setTableColumns(),
      formGroup: this.manageTeamForm,
      actionButtons: this.getActionButtons(),
      pageIndex: this.resourceSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.resourceSearchParams.pageSize,
      totalDataLength: this.resourceManageList?.totalRecords || 0,
      isNoRecordFound: !((this.resourceManageList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        if (this.filterForm.valid) {
          this.resourceSearchParams = {
            ...this.resourceSearchParams,
            pageNumber: (event?.pageIndex ?? 0) + 1,
            pageSize: event?.pageSize
          };
          this.uiService.setPageSize(event?.pageSize);
          this.getResourceManagementList();
        }
        else {
          this.setTableConfig();
        }
      },
      gridData: {
        data: this.resourceManageList?.records,
        dataSource: undefined
      },
      id: 'ResourceGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'fullName' },
        pageNumber: this.resourceSearchParams.pageNumber,
        pageSize: this.resourceSearchParams.pageSize
      },
      nestedGrid: {
        nestedActionButtons: this.getNestedActionButtons(),
        isContainNestedTable: true,
        expandField: "isExpanded",
        nestedGridField: "nestedGridConfig",
        expandableField: "noOfProjects",
      },
      getSortOrderAndColumn: (event) => {
        if (this.filterForm.valid) {
          if (event && event?.sortColumn && event?.sortDirection) {
            this.resourceSearchParams = {
              ...this.resourceSearchParams,
              sortBy: event?.sortColumn,
              pageNumber: 1,
              sortDirection: event?.sortDirection
            };

            this.getResourceManagementList();
          }
        }
        else {
          this.setTableConfig();
        }
      }
    };
    return config;
  }

  private setDropDownConfig(): void {
    this.designation = {
      data: {
        data: this.designationOptions,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'designation',
      formControlName: 'designationIds',
      label: 'Designation',
      placeHolder: 'Select Designation',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.technicalSkillDropdownConfig = {
      data: {
        data: this.technicalSkillDropdownOptions,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'technical Skill',
      formControlName: 'technicalSkillIds',
      label: 'Technical Skills',
      placeHolder: 'Select Technical Skill',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.department = {
      data: {
        data: this.departmentOptions,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'department',
      formControlName: 'departmentIds',
      label: 'Department',
      placeHolder: 'Select Department',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.employeeWorkStatus = {
      data: {
        data: EMPLOYEE_WORK_STATUS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'employeeWorkStatus',
      formControlName: 'workStatus',
      label: 'Employee Work Status',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.projectNature = {
      data: {
        data: this.projectNatureOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'projectNature',
      formControlName: 'projectNatureId',
      label: 'Project Nature',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.allocationType = {
      data: {
        data: ALLOCATION_TYPE,
      },
      feature: {
        allowMultiple: false
      },
      id: 'allocationType',
      formControlName: 'allocationTypeId',
      label: 'Allocation Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.type = {
      data: {
        data: TYPE,
      },
      feature: {
        allowMultiple: false
      },
      id: 'type',
      formControlName: 'type',
      label: 'Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: (event) => { this.hideFilters(event); },
      onEnterPress: () => { this.applyFilter(); }
    };
    this.pm_tl = {
      data: {
        data: this.pm_tlOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'pm_tl',
      formControlName: 'pmLeadId',
      label: 'PM/TL',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.employeeStatus = {
      data: {
        data: EMPLOYEE_STATUS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'employeeStatus',
      formControlName: 'memberStatusId',
      label: 'Employee Status',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.employeeName = {
      label: 'Employee Name',
      formControlName: 'search',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
  }

  private getActionButtons(): DataGridActionButton<IUserObject>[] {
    const actionsButton = [];
    actionsButton.push(
      {
        btnImageSrc: 'assets/images/history.svg',
        btnType: ButtonType.img,
        className: 'action-item table-icon-btn lg',
        tooltip: 'Immediate Senior History',
        callback: (data: DataGridFullRowData<IUserObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.RESOURCE_MANAGEMENT.MANAGE.ABSOLUTE_IMMEDIATE_SENIOR_HISTORY, data.rowData.id]);
          }
        },
      },
    );
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      search: '',
      workStatus: '',
      projectNatureId: 0,
      allocationTypeId: 0,
      memberStatusId: 1,
      designationIds: [],
      departmentIds: [],
      startDate: '',
      endDate: '',
      nonBillableOnly: false,
      excludeResignedMembers: false,
      pmLeadId: 0,
      type: 0,
      month: '',
      year: '',
      technicalSkillIds: []
    });
    this.resourceSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: 'ascending'
    };
    this.hideFilters();
    this.getResourceManagementList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.resourceSearchParams = {
      ...this.initialSearchParams,
      search: this.filterForm.get('search')?.value !== '' ? this.filterForm.get('search')?.value : null,
      workStatus: this.filterForm.get('workStatus')?.value !== '' ? this.filterForm.get('workStatus')?.value : null,
      projectNatureId: this.filterForm.get('projectNatureId')?.value > 0 ? this.filterForm.get('projectNatureId')?.value : null,
      allocationTypeId: this.filterForm.get('allocationTypeId')?.value > 0 ? this.filterForm.get('allocationTypeId')?.value : null,
      memberStatusId: this.filterForm.get('memberStatusId')?.value,
      designationIds: this.filterForm.get('designationIds')?.value?.length > 0 ? this.filterForm.get('designationIds')?.value : null,
      departmentIds: this.filterForm.get('departmentIds')?.value?.length > 0 ? this.filterForm.get('departmentIds')?.value : null,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : null,
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : null,
      nonBillableOnly: this.filterForm.get('nonBillableOnly')?.value,
      excludeResignedMembers: this.filterForm.get('excludeResignedMembers')?.value,
      pmLeadId: this.filterForm.get('pmLeadId')?.value > 0 ? this.filterForm.get('pmLeadId')?.value : null,
      technicalSkillIds: this.filterForm.get('technicalSkillIds')?.value?.length > 0 ? this.filterForm.get('technicalSkillIds')?.value : null,
    };
    if (this.isDaily) {
      this.resourceSearchParams = {
        ...this.resourceSearchParams,
        endDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : null,
      };
    }
    if (this.isMonthly) {
      const month = this.filterForm.get('month')?.value;
      const year = this.filterForm.get('year')?.value;
      this.resourceSearchParams = {
        ...this.resourceSearchParams,
        startDate: this.uiService.convertDateFormat(new Date(year, month - 1, 1).toDateString(), DateFormats.YYYY_MM_DD),
        endDate: this.uiService.convertDateFormat(new Date(year, month, 0).toDateString(), DateFormats.YYYY_MM_DD),
      };
    }
    this.getResourceManagementList();
  }

  private getDropDownItems() {
    forkJoin([
      this.uiService.getDropdownOptions(this.service.getDesignations(), false),
      this.uiService.getDropdownOptions(this.service.getDepartments(), false),
      this.uiService.getDropdownOptions(this.generalService.getTechnicalSkills(), false),
      this.uiService.getDropdownOptions(this.service.getPMTL(), true, { id: 0, text: 'Select PM/TL' }),
      this.uiService.getDropdownOptions(this.service.getProjectNature(), true, { id: 0, text: 'Select Project Nature' }),
    ]).subscribe({
      next: ([designationOptions, departmentOptions, technicalSkillDropdownOptions, pm_tlOptions, projectNatureOptions]: [DropdownValue[], DropdownValue[], DropdownValue[], DropdownValue[], DropdownValue[]]) => {
        this.designationOptions = designationOptions;
        this.departmentOptions = departmentOptions;
        this.technicalSkillDropdownOptions = technicalSkillDropdownOptions;
        this.pm_tlOptions = pm_tlOptions;
        this.projectNatureOptions = projectNatureOptions;
        this.setDropDownConfig();
      }
    });
  }

  private getReportingMembers() {
    this.uiService.getDropdownOptions(this.service.getReportingMembers(), false)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (data: DropdownValue[]) => {
          this.reportingMemberDropdownOptions = data;
        }
      });
  }

  private getResourceManagementList = () => {
    this.submitted = true;
    if (!this.filterForm.invalid || this.isDaily) {
      this.isGridLoading = true;
      const data = {
        ...this.resourceSearchParams
      };

      this.service.getResourcesList(data)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<IResourceManageList>) => {
            if (res.isSuccess && res.data) {
              this.resourceManageList = res.data;
              this.setTableConfig();
            }
          },
        });
    }
  };

  private hideFilters(event?: MatSelectChange): void {
    this.isWeekly = false;
    this.isDaily = false;
    this.isMonthly = false;
    this.submitted = false;
    this.filterForm.get('startDate')?.clearValidators();
    this.filterForm.get('endDate')?.clearValidators();
    this.filterForm.get('month')?.clearValidators();
    this.filterForm.get('year')?.clearValidators();
    this.filterForm.patchValue({
      startDate: '',
      endDate: '',
      month: '',
      year: '',
    });

    if (!event) {
      return;
    }

    switch (event.value) {
      case 1:
        this.isDaily = true;
        break;
      case 2:
        this.isWeekly = true;
        this.filterForm.get('startDate')?.setValidators(Validators.required);
        this.filterForm.get('endDate')?.setValidators(Validators.required);
        break;
      case 3:
        this.isMonthly = true;
        this.filterForm.get('month')?.setValidators(Validators.required);
        this.filterForm.get('year')?.setValidators(Validators.required);
        break;
      default:
        break;
    }

    this.setDatePickerConfig();
    this.filterForm.get('startDate')?.updateValueAndValidity();
    this.filterForm.get('endDate')?.updateValueAndValidity();
    this.filterForm.get('month')?.updateValueAndValidity();
    this.filterForm.get('year')?.updateValueAndValidity();
  }
  // #endregion
}
