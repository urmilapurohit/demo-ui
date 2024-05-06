/* eslint-disable no-nested-ternary */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFieldType, DataGridFullRowData, DateField, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages, DateFormats } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IHolidayList, IHolidayObject, IHolidaySearchParams } from '../../models/holiday';
import { HolidayService } from '../../services/holiday.service';
import { HOLIDAY_OPTIONS, HOLIDAY_TYPE_LABEL } from '../../constants/data';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.css'
})
export class HolidayComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  isPublicHoliday!: DropDown;
  startDate!: DateField;
  endDate!: DateField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IHolidaySearchParams = {
    ...DEFAULT_PAGINATION,
    remark: '',
    startDate: new Date(""),
    endDate: new Date(""),
    isPublicHoliday: true,
    sortBy: 'Remark'
  };
  submitted: boolean = false;
  holidayGridConfig!: DataGrid<IHolidayObject>;
  holidayList: IHolidayList | null = {} as IHolidayList;
  holidaySearchParams: IHolidaySearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "remark", title: "Name", customHeaderClassName: "name-column" },
    { field: "date", title: "Date", fieldDataType: DataGridFieldDataType.date, fieldType: DataGridFieldType.data, customHeaderClassName: "date-column" },
    { field: "holidayType", title: "Holiday Type", customHeaderClassName: "holiday-type-column" },
    { field: "createdOn", title: "Created On", fieldDataType: DataGridFieldDataType.date, fieldType: DataGridFieldType.data, customHeaderClassName: "date-column" },
    { field: "modifiedOn", title: "Modified On", fieldDataType: DataGridFieldDataType.date, fieldType: DataGridFieldType.data, customHeaderClassName: "date-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: HolidayService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.holidaySearchParams = {
      ...this.holidaySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.holidaySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Holiday);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getHolidayList();
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
      { label: 'Holiday', link: '' }
    ];
  }

  addPublicHoliday(): void {
    this.router.navigate([ROUTES.ADMIN.HOLIDAY.ADD_HOLIDAY_ABSOLUTE]);
  }

  addWeekoff(): void {
    this.router.navigate([ROUTES.ADMIN.HOLIDAY.ADD_WEEKOFF_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      startDate: [null],
      endDate: [null],
      isPublicHoliday: [HOLIDAY_TYPE_LABEL.PUBLIC_HOLIDAY]
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
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: false,
      placeholder: "DD-MMM-YYYY",
      max: () => this.filterForm.get('endDate')?.value,
      isYearPicker: false
    };
    this.endDate = {
      label: 'End Date',
      formControlName: 'endDate',
      needOnKeyDown: false,
      placeholder: "DD-MMM-YYYY",
      min: () => this.filterForm.get('startDate')?.value,
      isYearPicker: false
    };
    this.isPublicHoliday = {
      data: {
        data: HOLIDAY_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'isPublicHoliday',
      formControlName: 'isPublicHoliday',
      label: 'Holiday Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      startDate: '',
      endDate: '',
      isPublicHoliday: HOLIDAY_TYPE_LABEL.PUBLIC_HOLIDAY
    });
    this.holidaySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getHolidayList();
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
    this.holidayGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IHolidayObject> => {
    const config: DataGrid<IHolidayObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.holidaySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.holidaySearchParams.pageSize,
      totalDataLength: this.holidayList?.totalRecords || 0,
      isNoRecordFound: !((this.holidayList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.holidaySearchParams = {
          ...this.holidaySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getHolidayList();
      },
      gridData: {
        data: this.holidayList?.records,
        dataSource: undefined
      },
      id: 'HolidayGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'remark' },
        pageNumber: this.holidaySearchParams.pageNumber,
        pageSize: this.holidaySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.holidaySearchParams = {
            ...this.holidaySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getHolidayList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IHolidayObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IHolidayObject> = this.uiService.getEditActionButtonConfig(
        (data: DataGridFullRowData<IHolidayObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.ADMIN.HOLIDAY.EDIT_HOLIDAY_ABSOLUTE, data.rowData.id]);
          }
        },
        (data: IHolidayObject) => {
          return data.isPublicHoliday ?? true;
        }
      );
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton = this.uiService.getDeleteActionButtonConfig(
        (data: DataGridFullRowData<IHolidayObject>) => {
          if (data?.rowData?.id) {
            this.deleteHolidayRequest(Number(data.rowData.id));
          }
        },
        (data: IHolidayObject) => {
          return data.isPublicHoliday ?? true;
        }
      );
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private deleteHolidayRequest(holidayId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this public holiday?",
      () => {
        this.delete(holidayId);
      }
    );
  }

  private delete(holidayId: number): void {
    this.service.deleteHoliday(holidayId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IHolidayObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getHolidayList();
        }
      }
    });
  }

  private setPagination() {
    this.holidaySearchParams = this.uiService.adjustPagination(this.holidayList, this.holidaySearchParams);
  }

  private applyFilter(): void {
    this.resetSorting = true;
    const holidayType = this.filterForm.get('isPublicHoliday')?.value;

    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.holidaySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      remark: this.filterForm.get('searchName')?.value,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      isPublicHoliday: holidayType === HOLIDAY_TYPE_LABEL.PUBLIC_HOLIDAY ? true : (holidayType === HOLIDAY_TYPE_LABEL.WEEKOFF ? false : null)
    };
    this.getHolidayList();
  }

  private getHolidayList() {
    this.isGridLoading = true;
    this.submitted = true;
    const data = {
      ...this.holidaySearchParams
    };
    this.service.getHoliday(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IHolidayList>) => {
        if (res.isSuccess && res.data) {
          this.holidayList = res.data;
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
  // #endregion
}
