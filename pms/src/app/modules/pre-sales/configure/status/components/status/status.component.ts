import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IStatusList, IStatusObject, IStatusSearchParams } from '../../models/status.model';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})

export class StatusComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IStatusSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name'
  };
  statusGridConfig!: DataGrid<IStatusObject>;
  statusList: IStatusList | null = {} as IStatusList;
  statusSearchParams: IStatusSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    {
      field: "name",
      title: "Name",
      customHeaderClassName: 'name-column'
    },
    {
      field: "isVisibleInBde",
      title: "BDE",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: 'yes-no-column'
    },
    {
      field: "isVisibleInBa",
      title: "BA",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: 'yes-no-column'
    },
    {
      field: "isOpenInquiry",
      title: "Is Open Inquiry",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: 'yes-no-column'
    },
    {
      field: "isEstimationDateRequired",
      title: "Estimation Date Required",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: 'yes-no-column'
    },
    {
      field: "displayOrder",
      title: "Display Order",
      fieldDataType: DataGridFieldDataType.number,
      customHeaderClassName: 'order-column'
    }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: StatusService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.statusSearchParams = {
      ...this.statusSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.statusSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.PreSalesStatus);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getStatusList();
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
      { label: 'Pre-Sales', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Status', link: '' }
    ];
  }

  addStatus(): void {
    this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.STATUS.ADD_STATUS_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
    });
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.statusGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IStatusObject> => {
    const config: DataGrid<IStatusObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.statusSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.statusSearchParams.pageSize,
      totalDataLength: this.statusList?.totalRecords || 0,
      isNoRecordFound: !((this.statusList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.statusSearchParams = {
          ...this.statusSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getStatusList();
      },
      gridData: {
        data: this.statusList?.records,
        dataSource: undefined
      },
      id: 'statusGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.statusSearchParams.pageNumber,
        pageSize: this.statusSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.statusSearchParams = {
            ...this.statusSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getStatusList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IStatusObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IStatusObject> = this.uiService.getEditActionButtonConfig(
        (data: DataGridFullRowData<IStatusObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.STATUS.EDIT_STATUS_ABSOLUTE, data.rowData.id]);
          }
        },
        (data: IStatusObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton: DataGridActionButton<IStatusObject> = this.uiService.getDeleteActionButtonConfig(
        (data: DataGridFullRowData<IStatusObject>) => {
          if (data?.rowData?.id) {
            this.deleteStatusRequest(Number(data.rowData.id));
          }
        },
        (data: IStatusObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private getStatusList() {
    this.isGridLoading = true;
    const data = {
      ...this.statusSearchParams
    };

    this.service.getStatuses(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IStatusList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.statusList = res.data;
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

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: ''
    });
    this.statusSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getStatusList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.statusSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value
    };
    this.getStatusList();
  }

  private deleteStatusRequest(statusId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this status?",
      () => {
        this.deleteStatus(statusId);
      }
    );
  }

  private setPagination() {
    this.statusSearchParams = this.uiService.adjustPagination(this.statusList, this.statusSearchParams);
  }

  private deleteStatus(statusId: number): void {
    this.service.deleteStatus(statusId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IStatusObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getStatusList();
        }
      }
    });
  }
  // #endregion
}
