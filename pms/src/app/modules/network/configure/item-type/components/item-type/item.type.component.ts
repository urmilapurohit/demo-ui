import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { PermissionService } from '@services/permission.service';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { IItemTypeList, IItemTypeObject, IItemTypeSearchParams } from '../../models/item.type';
import { ItemTypeService } from '../../services/item.type.service';

@Component({
  selector: 'app-item-type',
  templateUrl: './item.type.component.html',
  styleUrl: './item.type.component.css'
})
export class ItemTypeComponent implements OnInit, OnDestroy {
  // #region initialize variables
  filterForm!: FormGroup;
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IItemTypeSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  itemTypeGridConfig!: DataGrid<IItemTypeObject>;
  itemTypeList: IItemTypeList | null = {} as IItemTypeList;
  itemTypeSearchParams: IItemTypeSearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: 'name-column' },
    { field: "description", title: "Description", customHeaderClassName: 'desc-column' },
    { field: "isSerialRequired", title: "Is Serial Required?", fieldDataType: DataGridFieldDataType.boolean, isSortable: false, customHeaderClassName: 'yes-no-column' }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ItemTypeService,
    private fb: FormBuilder,
    private uiService: UIService,
    private permissionService: PermissionService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.itemTypeSearchParams = {
      ...this.itemTypeSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.itemTypeSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NetworkItemType);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getItemTypeList();
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
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Item Type', link: '' }
    ];
  }

  addItemType() {
    this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ADD_ITEM_TYPE_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
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

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.itemTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getItemTypeList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.itemTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getItemTypeList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.itemTypeGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getActionButtons(): DataGridActionButton<IItemTypeObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IItemTypeObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IItemTypeObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.EDIT_ITEM_TYPE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);

      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IItemTypeObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }
  private setPagination() {
    this.itemTypeSearchParams = this.uiService.adjustPagination(this.itemTypeList, this.itemTypeSearchParams);
  }

  private changeStatus(itemTypeId: number, isActive: boolean): void {
    this.service.updateStatus(itemTypeId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IItemTypeObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getItemTypeList();
        }
      }
    });
  }

  private updateStatusConfirmation(itemTypeId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(itemTypeId, isActive); });
  }

  private getGridConfig = (): DataGrid<IItemTypeObject> => {
    const config: DataGrid<IItemTypeObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.itemTypeSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.itemTypeSearchParams.pageSize,
      totalDataLength: this.itemTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.itemTypeList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.itemTypeSearchParams = {
          ...this.itemTypeSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getItemTypeList();
      },
      gridData: {
        data: this.itemTypeList?.records,
        dataSource: undefined
      },
      id: 'ItemTypeGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.itemTypeSearchParams.pageNumber,
        pageSize: this.itemTypeSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.itemTypeSearchParams = {
            ...this.itemTypeSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getItemTypeList();
        }
      }
    };
    return config;
  };

  private getItemTypeList() {
    this.isGridLoading = true;
    const data = {
      ...this.itemTypeSearchParams
    };

    this.service.getItemType(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IItemTypeList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.itemTypeList = res.data;
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
  // #endregion
}
