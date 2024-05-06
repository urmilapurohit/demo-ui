import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IItemModelList, IItemModelObject, IItemModelSearchParams } from '../../models/item.model';
import { ItemModelService } from '../../services/item.model.service';

@Component({
  selector: 'app-item-model',
  templateUrl: './item.model.component.html',
  styleUrl: './item.model.component.css'
})
export class ItemModelComponent implements OnInit, OnDestroy {
  // #region initialize variables
  filterForm!: FormGroup;
  searchName!: TextField;
  networkItemType!: DropDown;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IItemModelSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    networkItemTypeId: 0,
    isActive: true,
    sortBy: 'Name'
  };
  itemModelGridConfig!: DataGrid<IItemModelObject>;
  itemModelList: IItemModelList | null = {} as IItemModelList;
  itemTypeList!: DropdownValue[];
  itemModelSearchParams: IItemModelSearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "networkItemTypeName", title: "Item Type", customHeaderClassName: 'item-type-column' },
    { field: "name", title: "Name", customHeaderClassName: 'name-column' },
    { field: "description", title: "Description", isSortable: false, customHeaderClassName: 'desc-column' },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ItemModelService,
    private fb: FormBuilder,
    private uiService: UIService,
    private permissionService: PermissionService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.itemModelSearchParams = {
      ...this.itemModelSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.itemModelSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.NetworkItemModel);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getItemTypeList();
    this.getItemModelList();
    this.setTableConfig();
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
      { label: 'Item Model', link: '' }
    ];
  }

  addItemModel() {
    this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ADD_ITEM_MODEL_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      searchName: [""],
      networkItemType: [0],
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
    this.networkItemType = {
      data: {
        data: this.itemTypeList
      },
      feature: {
        allowMultiple: false
      },
      id: 'itemType',
      formControlName: 'networkItemType',
      label: 'Item Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
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
    this.itemModelSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      networkItemTypeId: this.filterForm.get('networkItemType')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getItemModelList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      networkItemType: 0,
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.itemModelSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getItemModelList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.itemModelGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getActionButtons(): DataGridActionButton<IItemModelObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IItemModelObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IItemModelObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.EDIT_ITEM_MODEL_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IItemModelObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private setPagination() {
    this.itemModelSearchParams = this.uiService.adjustPagination(this.itemModelList, this.itemModelSearchParams);
  }

  private changeStatus(itemModelId: number, isActive: boolean): void {
    this.service.updateStatus(itemModelId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IItemModelObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getItemModelList();
        }
      },
      error: () => { }
    });
  }

  private updateStatusConfirmation(itemModelId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(itemModelId, isActive); });
  }

  private getGridConfig = (): DataGrid<IItemModelObject> => {
    const config: DataGrid<IItemModelObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.itemModelSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.itemModelSearchParams.pageSize,
      totalDataLength: this.itemModelList?.totalRecords || 0,
      isNoRecordFound: !((this.itemModelList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.itemModelSearchParams = {
          ...this.itemModelSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getItemModelList();
      },
      gridData: {
        data: this.itemModelList?.records,
        dataSource: undefined
      },
      id: 'ItemModelGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.itemModelSearchParams.pageNumber,
        pageSize: this.itemModelSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.itemModelSearchParams = {
            ...this.itemModelSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };
          this.getItemModelList();
        }
      }
    };
    return config;
  };

  private getItemModelList() {
    this.isGridLoading = true;
    const data = {
      ...this.itemModelSearchParams
    };
    this.service.getItemModel(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IItemModelList>) => {
        if (res.isSuccess && res.data) {
          this.itemModelList = res.data;
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

  private getItemTypeList() {
    this.uiService.getDropdownOptions(this.service.getItemTypeDropDown(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.itemTypeList = data;
        this.setTextBoxConfig();
      }
    });
  }
  // #endregion
}
