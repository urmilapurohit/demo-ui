import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DateField, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { DateFormats, Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { INewsEventList, INewsEventObject, INewsEventSearchParams } from '../../models/news.event';
import { NewsEventService } from '../../services/news.event.service';

@Component({
  selector: 'app-news-event',
  templateUrl: './news.event.component.html',
  styleUrl: './news.event.component.css'
})
export class NewsEventComponent implements OnInit, OnDestroy {
  // #region initialize variables
  filterForm!: FormGroup;
  searchName!: TextField;
  status!: DropDown;
  startDate!: DateField;
  endDate!: DateField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: INewsEventSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    startDate: new Date(""),
    endDate: new Date(""),
    isActive: true,
    sortBy: 'Title'
  };
  newsEventGridConfig!: DataGrid<INewsEventObject>;
  newsEventList: INewsEventList | null = {} as INewsEventList;
  newsEventSearchParams: INewsEventSearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "title", title: "Title", customHeaderClassName: 'news-event-title-column' },
    { field: "startDate", title: "Start Date", fieldDataType: DataGridFieldDataType.date, customHeaderClassName: 'news-event-column' },
    { field: "endDate", title: "End Date", fieldDataType: DataGridFieldDataType.date, customHeaderClassName: 'news-event-column' },
    { field: "createdByName", title: "Created By", customHeaderClassName: 'news-event-column' },
    { field: "createdOn", title: "Created On", fieldDataType: DataGridFieldDataType.date, customHeaderClassName: 'news-event-column' },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: NewsEventService,
    private fb: FormBuilder,
    private uiService: UIService,
    private permissionService: PermissionService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.newsEventSearchParams = {
      ...this.newsEventSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.newsEventSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NewsEvents);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getNewsEventList();
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
      { label: 'News/Event', link: '' }
    ];
  }

  addNewsEvent() {
    this.router.navigate([ROUTES.ADMIN.NEWS_EVENT.ADD_NEWS_EVENT_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      searchName: [""],
      startDate: [null],
      endDate: [null],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Title',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: true,
      max: () => this.filterForm.get('endDate')?.value,
      isYearPicker: false
    };
    this.endDate = {
      label: 'End Date',
      formControlName: 'endDate',
      needOnKeyDown: true,
      min: () => this.filterForm.get('startDate')?.value,
      isYearPicker: false
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.newsEventSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      startDate: this.filterForm.get('startDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('startDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      endDate: this.filterForm.get('endDate')?.value ? this.uiService.convertDateFormat(this.filterForm.get('endDate')?.value, DateFormats.YYYY_MM_DD) : new Date(""),
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getNewsEventList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      startDate: '',
      endDate: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.newsEventSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getNewsEventList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.newsEventGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getActionButtons(): DataGridActionButton<INewsEventObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<INewsEventObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<INewsEventObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.NEWS_EVENT.EDIT_NEWS_EVENT_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);

      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<INewsEventObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private setPagination() {
    this.newsEventSearchParams = this.uiService.adjustPagination(this.newsEventList, this.newsEventSearchParams);
  }

  private changeStatus(newsEventId: number, isActive: boolean): void {
    this.service.updateStatus(newsEventId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<INewsEventObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getNewsEventList();
        }
      }
    });
  }

  private updateStatusConfirmation(newsEventId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(newsEventId, isActive); });
  }

  private getGridConfig = (): DataGrid<INewsEventObject> => {
    const config: DataGrid<INewsEventObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.newsEventSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.newsEventSearchParams.pageSize,
      totalDataLength: this.newsEventList?.totalRecords || 0,
      isNoRecordFound: !((this.newsEventList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.newsEventSearchParams = {
          ...this.newsEventSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getNewsEventList();
      },
      gridData: {
        data: this.newsEventList?.records,
        dataSource: undefined
      },
      id: 'NewsEventGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'title' },
        pageNumber: this.newsEventSearchParams.pageNumber,
        pageSize: this.newsEventSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.newsEventSearchParams = {
            ...this.newsEventSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };
          this.getNewsEventList();
        }
      }
    };
    return config;
  };

  private getNewsEventList() {
    this.isGridLoading = true;
    const data = {
      ...this.newsEventSearchParams
    };

    this.service.getNewsEvent(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INewsEventList>) => {
        if (res.isSuccess && res.data) {
          this.newsEventList = res.data;
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
