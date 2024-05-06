import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, GlobalService } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS, } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { SDLCTypeService } from '../../services/sdlc.type.service';
import { ISdlcTypeList, ISdlcTypeObject, ISdlcTypeSearchParams } from '../../models/sdlc.type';

@Component({
  selector: 'app-sdlc-type',
  templateUrl: './sdlc.type.component.html',
  styleUrl: './sdlc.type.component.css'
})
export class SdlcTypeComponent implements OnInit, OnDestroy {
  // #region class members
  public contentLoaded: boolean = false;
  sdlcTypeGridConfig!: DataGrid<ISdlcTypeObject>;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  sdlcTypeList: ISdlcTypeList | null = {} as ISdlcTypeList;
  initialSearchParams: ISdlcTypeSearchParams = {
    ...DEFAULT_PAGINATION,
    isActive: true,
    sortBy: 'Name'
  };
  sdlcTypeSearchParams: ISdlcTypeSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name" }
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: SDLCTypeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.sdlcTypeSearchParams = {
      ...this.sdlcTypeSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.sdlcTypeSearchParams.pageSize
    };

    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ProjectSDLCType);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTableConfig();
    this.getSdlcTypeList();
    this.setBreadcrumb();
    this.setButtonConfig();
    this.setStatusConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }
  // #region class methods
  addSdlcType(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.ADD_SDLC_TYPE_ABSOLUTE]);
  }

  private getSdlcTypeList() {
    this.isGridLoading = true;
    const data = {
      ...this.sdlcTypeSearchParams
    };

    this.service.getSdlcType(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcTypeList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.sdlcTypeList = res.data;
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

  private setPagination() {
    this.sdlcTypeSearchParams = this.uiService.adjustPagination(this.sdlcTypeList, this.sdlcTypeSearchParams);
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'SDLC Type', link: '' }
    ];
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setStatusConfig(): void {
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      searchDescription: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.sdlcTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getSdlcTypeList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.sdlcTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getSdlcTypeList();
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
    this.sdlcTypeGridConfig = this.getGridConfig();
  }
  private getGridConfig = (): DataGrid<ISdlcTypeObject> => {
    const config: DataGrid<ISdlcTypeObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.sdlcTypeSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.sdlcTypeSearchParams.pageSize,
      totalDataLength: this.sdlcTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.sdlcTypeList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.sdlcTypeSearchParams = {
          ...this.sdlcTypeSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getSdlcTypeList();
      },
      gridData: {
        data: this.sdlcTypeList?.records,
        dataSource: undefined
      },
      id: 'SdlcTypeGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.sdlcTypeSearchParams.pageNumber,
        pageSize: this.sdlcTypeSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.sdlcTypeSearchParams = {
            ...this.sdlcTypeSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getSdlcTypeList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ISdlcTypeObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ISdlcTypeObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISdlcTypeObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<ISdlcTypeObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private changeStatus(sdlcTypeId: number, isActive: boolean): void {
    this.service.updateStatus(sdlcTypeId, !isActive)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response: BaseResponseModel<ISdlcTypeObject>) => {
          if (response.isSuccess) {
            this.globalService.openSnackBar(response?.message);
            this.setPagination();
            this.getSdlcTypeList();
          }
        },
      });
  }

  private updateStatusConfirmation(sdlcTypeId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(sdlcTypeId, isActive); });
  }
  // #endregion
}
