import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, Checkbox, DataGrid, DataGridFieldDataType, DataGridFieldType, DateField, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { DEFAULT_PAGINATION } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { GeneralService } from '@services/general.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { AuditLogTypes, DateFormats, Pages } from '@constants/Enums';
import { IAuditLogDelete, IAuditLogList, IAuditLogObject, IAuditLogSearchParams } from '../../models/audit.log';
import { AuditLogService } from '../../services/audit.log.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit.log.component.html',
  styleUrl: './audit.log.component.css'
})
export class AuditLogComponent implements OnInit, OnDestroy {
  // #region initialize variables
  startDate!: DateField;
  endDate!: DateField;
  auditLogType!: DropDown;
  moduleAccess!: DropDown;
  pageAccess!: DropDown;
  member!: DropDown;
  selectAuditLog!: Checkbox;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  deleteBtnConfig!: Button;
  auditLogGridConfig!: DataGrid<IAuditLogObject>;
  auditLogList: IAuditLogList | null = {} as IAuditLogList;
  initialSearchParams: IAuditLogSearchParams = {
    ...DEFAULT_PAGINATION,
    startDate: new Date(""),
    endDate: new Date(""),
    sortBy: 'CreatedOn',
    sortDirection: 'descending'
  };
  auditLogSearchParams: IAuditLogSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  gridForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  moduleList!: DropdownValue[];
  pageList: DropdownValue[] = [{ id: 0, text: "Select Page" }];
  auditTypeList!: DropdownValue[];
  memberList!: DropdownValue[];
  isModuleFilterVisible: boolean = false;
  isPageFilterVisible: boolean = false;
  moduleId: number = 2;
  today = new Date();
  firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  tableColumns: any[] = [
    { field: "createdOn", title: "Date", fieldDataType: DataGridFieldDataType.dateTime, customHeaderClassName: "date" },
    { field: "userName", title: "User", customHeaderClassName: "user" },
    { field: "moduleName", title: "Module", customHeaderClassName: "module" },
    { field: "pageName", title: "Page", customHeaderClassName: "page" },
    { field: "details", title: "Audit Log", customHeaderClassName: "details" },
    { field: "ipAddress", title: "Ip Address", customHeaderClassName: "ipAddress" },
    { field: "browser", title: "Browser", customHeaderClassName: "desc-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: AuditLogService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public globalService: GlobalService,
    public router: Router,
    private uiService: UIService,
    private permissionService: PermissionService,
    private generalService: GeneralService
  ) {
    this.auditLogSearchParams = {
      ...this.auditLogSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.auditLogSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AdminAuditLog);
  }
  // #endregion
  ngOnInit(): void {
    this.initializeForm();
    this.getDropdownOptions();
    this.setDatePickerConfig();
    this.setCheckBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getAuditLogList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Audit Log', link: '' }
    ];
  }
  private onSingleCheckBoxChange = (
    data: MatCheckboxChange,
    formControlName: string | undefined
  ): void => {
    const gridCheckBoxControl = <FormControl>(
      this.gridForm.get(`selectAuditLog_${formControlName?.split('_')[1]}`)
    );
    if (gridCheckBoxControl) {
      gridCheckBoxControl.patchValue(data.checked);
    }
    this.setAllCheckbox();
    this.deleteButtonDisable();
  };
  private setPagination() {
    this.auditLogSearchParams = this.uiService.adjustPagination(this.auditLogList, this.auditLogSearchParams);
  }
  private setAllCheckbox = (): void => {
    let isChecked = true;
    this.auditLogList?.records?.forEach((record) => {
      const checkBoxControl = <FormControl>(
        this.gridForm.get(`selectAuditLog_${record.id}`)
      );
      if (!checkBoxControl.value) {
        isChecked = false;
      }
    });
    this.gridForm.get(`selectAuditLog`)?.patchValue(isChecked);
  };
  private onSelectAllAuditLog = (
    data: MatCheckboxChange,
  ): void => {
    this.auditLogList?.records?.forEach((record) => {
      const checkBoxControl = <FormControl>(
        this.gridForm.get(`selectAuditLog_${record.id}`)
      );
      if (checkBoxControl) {
        checkBoxControl.patchValue(data.checked);
      }
    });
    this.deleteButtonDisable();
  };
  private getAuditLogList() {
    this.isGridLoading = true;
    const data = {
      ...this.auditLogSearchParams
    };

    this.removeAllControls(["selectAuditLog"]);
    this.gridForm.patchValue({
      selectAuditLog: false
    });
    this.service.getAuditLogs(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IAuditLogList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.auditLogList = res.data;
            this.bindControls();
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
  private deleteAuditLog(): void {
    const ids: number[] = [];
    this.auditLogList?.records?.forEach((record) => {
      const checkBoxControl = <FormControl>(
        this.gridForm.get(`selectAuditLog_${record.id}`)
      );
      if (checkBoxControl.value) {
        ids.push(record.id);
      }
    });
    this.deleteAuditLogConfirmation(ids.join(','));
  }
  private deleteButtonDisable(): void {
    const ids: number[] = [];
    this.auditLogList?.records?.forEach((record) => {
      const checkBoxControl = <FormControl>(
        this.gridForm.get(`selectAuditLog_${record.id}`)
      );
      if (checkBoxControl.value) {
        ids.push(record.id);
      }
    });
    this.setDeleteButtonConfig(ids.length <= 0);
  }
  private removeAllControls(controlsToRemove: string[]): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const controlName in this.gridForm.controls) {
      if (this.gridForm.controls[`${controlName}`]) {
        if (!controlsToRemove.includes(controlName)) {
          this.gridForm.removeControl(controlName);
        }
      }
    }
  }
  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      moduleId: 0,
      modulePageId: 0,
      typeId: 0,
      startDate: this.firstDayOfMonth,
      endDate: this.today,
      memberIds: null
    });
    this.gridForm = this.fb?.group({
      selectAuditLog: [false]
    });
    this.auditLogSearchParams = {
      ...this.initialSearchParams,
      startDate: this.uiService.convertDateFormat(this.firstDayOfMonth.toString(), DateFormats.YYYY_MM_DD),
      endDate: this.uiService.convertDateFormat(this.today.toString(), DateFormats.YYYY_MM_DD),
    };
  }
  private getDropdownOptions() {
    forkJoin([
      this.uiService.getDropdownOptions(this.service.getAuditLogType(), true, { id: 0, text: 'Select Type' }),
      this.uiService.getDropdownOptions(this.service.getModuleList(), true, { id: 0, text: 'Select Module' }),
      this.uiService.getDropdownOptions(this.generalService.getMembers(), false)
    ]).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: ([auditTypeList, moduleList, memberList]: [DropdownValue[], DropdownValue[], DropdownValue[]]) => {
        this.auditTypeList = auditTypeList;
        this.moduleList = moduleList;
        this.memberList = memberList;
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
      isYearPicker: false
    };
    this.endDate = {
      label: 'End Date',
      needOnKeyDown: true,
      formControlName: 'endDate',
      min: () => this.filterForm.get('startDate')?.value,
      max: () => this.today,
      isYearPicker: false
    };
  };
  private setDropDownConfig = (): void => {
    this.auditLogType = {
      data: {
        data: this.auditTypeList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'auditLogType',
      formControlName: 'typeId',
      label: 'Audit Log Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); },
      selectionChange: (event) => { this.hideFilters(event); }
    };
    this.moduleAccess = {
      data: {
        data: this.moduleList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'module',
      formControlName: 'moduleId',
      label: 'Module',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); },
      selectionChange: (event) => { this.getPagesList(event); }
    };
    this.pageAccess = {
      data: {
        data: this.pageList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'page',
      formControlName: 'modulePageId',
      label: 'Page',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.member = {
      data: {
        data: this.memberList,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'memberIds',
      formControlName: 'memberIds',
      label: 'User',
      customFormFieldClass: 'custom-form-group sm-form-group',
      placeHolder: 'Select User',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setDeleteButtonConfig = (disable: boolean): void => {
    this.deleteBtnConfig = this.uiService.getDeleteButtonConfig(() => { this.deleteAuditLog(); }, disable);
  };
  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    this.setDeleteButtonConfig(true);
  }
  private setCheckBoxConfig = (): void => {
    this.selectAuditLog = {
      label: '',
      formControlName: 'selectAuditLog',
      customFormFieldClass: 'custom-form-control',
      change: this.onSelectAllAuditLog,
    };
  };
  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      typeId: 0,
      moduleId: 0,
      modulePageId: 0,
      memberIds: null,
      startDate: this.firstDayOfMonth,
      endDate: this.today
    });
    this.auditLogSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortBy: 'CreatedOn',
      sortDirection: 'descending',
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
    };
    this.removeAllControls(["selectAuditLog"]);
    this.gridForm.patchValue({
      selectAuditLog: false
    });
    this.getAuditLogList();
    this.setDeleteButtonConfig(true);
    this.isModuleFilterVisible = false;
    this.isPageFilterVisible = false;
  }
  private setTableConfig(): void {
    this.resetSorting = false;
    this.auditLogGridConfig = this.getGridConfig();
  }
  private getGridConfig = (): DataGrid<any> => {
    const config: DataGrid<IAuditLogObject> = {
      columns: this.setTableColumns(),
      formGroup: this.gridForm,
      pageIndex: this.auditLogSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.auditLogSearchParams.pageSize,
      totalDataLength: this.auditLogList?.totalRecords || 0,
      isNoRecordFound: !((this.auditLogList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.auditLogSearchParams = {
          ...this.auditLogSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getAuditLogList();
      },
      gridData: {
        data: this.auditLogList?.records,
        dataSource: undefined
      },
      id: 'AuditLogGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'desc', sortColumn: 'createdOn' },
        pageNumber: this.auditLogSearchParams.pageNumber,
        pageSize: this.auditLogSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.auditLogSearchParams = {
            ...this.auditLogSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getAuditLogList();
        }
      }
    };
    return config;
  };
  private setTableColumns() {
    const columnData: any[] = [];
    columnData.push({
      field: "selectAuditLog",
      title: "selectAuditLog",
      fieldDataType: DataGridFieldDataType.boolean,
      fieldType: DataGridFieldType.data,
      isSortable: false,
      customHeaderClassName: "checkbox-column",
      headerEditConfig: {
        controlType: 'checkbox',
        controlConfig: this.selectAuditLog,
      },
      editConfig: {
        isEditable: true,
        idFieldKey: 'id',
        needToShowBasedOn: "FormControl",
        controlType: 'checkbox',
        checkboxChange: this.onSingleCheckBoxChange
      },
    });
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }
  private bindControls(): void {
    this.gridForm.patchValue({
      selectAuditLog: false
    });
    this.auditLogList?.records.forEach((element) => {
      this.gridForm.addControl(
        "selectAuditLog_".concat(element.id.toString()),
        new FormControl({ value: false, disabled: false })
      );
    });
  }
  private applyFilter(): void {
    this.resetSorting = true;
    this.auditLogSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      typeId: this.filterForm.get('typeId')?.value > 0 ? this.filterForm.get('typeId')?.value : null,
      moduleId: this.filterForm.get('moduleId')?.value > 0 ? this.filterForm.get('moduleId')?.value : null,
      modulePageId: this.filterForm.get('modulePageId')?.value > 0 ? this.filterForm.get('modulePageId')?.value : null,
      memberIds: this.filterForm.get('memberIds')?.value ?? null
    };
    this.removeAllControls(["selectAuditLog"]);
    this.gridForm.patchValue({
      selectAuditLog: false
    });
    this.getAuditLogList();
    this.setDeleteButtonConfig(true);
  }
  private deleteAuditLogs(ids: string): void {
    const data: IAuditLogDelete = {
      ids
    };
    this.service.deleteAuditLogs(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IAuditLogObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.getAuditLogList();
          this.setButtonConfig();
        }
      },
    });
  }
  private deleteAuditLogConfirmation(ids: string): void {
    this.uiService.openDeleteModel(() => { this.deleteAuditLogs(ids); });
  }

  private getPagesList(event?: MatSelectChange): void {
    this.filterForm.patchValue({
      modulePageId: 0,
    });
    this.uiService.getDropdownOptions(this.service.getPageList(event?.value), true, { id: 0, text: 'Select Page' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.pageList = data;
        this.setDropDownConfig();
      },
    });
  }
  private hideFilters(event?: MatSelectChange): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      moduleId: 0,
      modulePageId: 0,
    });
    this.auditLogSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: 'descending',
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
    };
    if (!event) {
      return;
    }

    switch (event.value) {
      case AuditLogTypes.MODULE_ACCESS:
        this.isPageFilterVisible = false;
        this.isModuleFilterVisible = true;
        break;
      case AuditLogTypes.USER_LOGIN:
        this.isModuleFilterVisible = false;
        this.isPageFilterVisible = false;
        break;
      case AuditLogTypes.PAGE_ACCESS:
        this.isModuleFilterVisible = true;
        this.isPageFilterVisible = true;
        break;
      default:
        this.isModuleFilterVisible = false;
        this.isPageFilterVisible = false;
        break;
    }
  }
  // #endregion
}
