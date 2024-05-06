import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TextField, Button, DataGrid, GlobalService, InputType, DataGridActionButton, DataGridFullRowData, BaseResponseModel, DropDown, DataGridFieldDataType, DataGridFieldType } from 'workspace-library';
import { UIService } from '@services/ui.service';
import { Pages } from '@constants/Enums';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { SystemTypeService } from '../../services/system.type.service';
import { ISystemTypeList, ISystemTypeObject, ISystemTypeSearchParams } from '../../models/system-type';

@Component({
  selector: 'app-system.type',
  templateUrl: './system.type.component.html',
  styleUrl: './system.type.component.css'
})
export class SystemTypeComponent implements OnInit, OnDestroy {
  // #region class members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  systemTypeGridConfig!: DataGrid<ISystemTypeObject>;
  systemTypeList: ISystemTypeList | null = {} as ISystemTypeList;
  initialSearchParams: ISystemTypeSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name',
    isActive: true
  };
  systemTypeSearchParams: ISystemTypeSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  pagePermissions: PageAccessPermission;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: SystemTypeService,
    private fb: FormBuilder,
    public globalService: GlobalService,
    public router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.systemTypeSearchParams = {
      ...this.systemTypeSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.systemTypeSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NetworkSystemType);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.setTableConfig();
    this.getSystemTypeList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'System Type', link: '' },
    ];
  }

  addSystemType(): void {
    this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.ADD_SYSTEM_TYPE_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
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
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.systemTypeGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<ISystemTypeObject> => {
    const config: DataGrid<ISystemTypeObject> = {
      actionButtons: this.getActionButtons(),
      columns: [
        {
          field: "name",
          title: "Name",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true
        }
      ],
      pageIndex: this.systemTypeSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.systemTypeSearchParams.pageSize,
      totalDataLength: this.systemTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.systemTypeList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.systemTypeSearchParams = {
          ...this.systemTypeSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getSystemTypeList();
      },
      gridData: {
        data: this.systemTypeList?.records,
        dataSource: undefined
      },
      id: 'SystemTypeGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.systemTypeSearchParams.pageNumber,
        pageSize: this.systemTypeSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.systemTypeSearchParams = {
            ...this.systemTypeSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getSystemTypeList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ISystemTypeObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ISystemTypeObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISystemTypeObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.EDIT_SYSTEM_TYPE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<ISystemTypeObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.systemTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getSystemTypeList();
  }

  private getSystemTypeList() {
    this.isGridLoading = true;
    const data = {
      ...this.systemTypeSearchParams
    };

    this.service.getSystemTypes(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISystemTypeList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.systemTypeList = res.data;
            this.setTableConfig();
          }
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
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.systemTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getSystemTypeList();
  }

  private setPagination() {
    this.systemTypeSearchParams = this.uiService.adjustPagination(this.systemTypeList, this.systemTypeSearchParams);
  }

  private changeStatus(SystemTypeId: number, isActive: boolean): void {
    this.service.updateStatus(SystemTypeId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ISystemTypeObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getSystemTypeList();
        }
      }
    });
  }

  private updateStatusConfirmation(SystemTypeId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(SystemTypeId, isActive); });
  }
  // #endregion
}
