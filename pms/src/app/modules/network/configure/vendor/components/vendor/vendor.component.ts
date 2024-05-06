import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { DEFAULT_PAGINATION, ACTIVE_INACTIVE_STATUS_LABEL, GLOBAL_CONSTANTS, DEFAULT_ORDER } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IVendorSearchParams, IVendorObject, IVendorList } from '../../models/vendor';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  phoneNumber!: TextField;
  alternatePhoneNumber!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IVendorSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    phoneNo: '',
    alternatePhoneNo: '',
    sortBy: 'Name',
    isActive: true
  };
  vendorGridConfig!: DataGrid<IVendorObject>;
  vendorList: IVendorList | null = {} as IVendorList;
  vendorSearchParams: IVendorSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "vendor-name-column" },
    { field: "phoneNo", title: "Phone Number", customHeaderClassName: "vendor-phnnum-column" },
    { field: "alternatePhoneNo", title: "Alternate Phone Number", customHeaderClassName: "vendor-alternate-phnnum-column" },
    { field: "address", title: "Address", customHeaderClassName: "vendor-address-column" },
    { field: "comments", title: "Comments", customHeaderClassName: "vendor-comments-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: VendorService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.vendorSearchParams = {
      ...this.vendorSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.vendorSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Vendor);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.setTableConfig();
    this.getVendorList();
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
      { label: 'Vendor', link: '' },
    ];
  }

  addVendor(): void {
    this.router.navigate([ROUTES.NETWORK.CONFIGURATION.VENDOR.ADD_VENDOR_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      phoneNumber: [""],
      alternatePhoneNumber: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
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
    this.phoneNumber = {
      label: 'Phone Number',
      formControlName: 'phoneNumber',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); },
    };
    this.alternatePhoneNumber = {
      label: 'Alternate Phone Number',
      formControlName: 'alternatePhoneNumber',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); },
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.vendorGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IVendorObject> => {
    const config: DataGrid<IVendorObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.vendorSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.vendorSearchParams.pageSize,
      totalDataLength: this.vendorList?.totalRecords || 0,
      isNoRecordFound: !((this.vendorList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.vendorSearchParams = {
          ...this.vendorSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getVendorList();
      },
      gridData: {
        data: this.vendorList?.records,
        dataSource: undefined
      },
      id: 'VendorGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.vendorSearchParams.pageNumber,
        pageSize: this.vendorSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.vendorSearchParams = {
            ...this.vendorSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getVendorList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IVendorObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IVendorObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IVendorObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.NETWORK.CONFIGURATION.VENDOR.EDIT_VENDOR_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IVendorObject>) => {
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
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.vendorSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      phoneNo: this.filterForm.get('phoneNumber')?.value,
      alternatePhoneNo: this.filterForm.get('alternatePhoneNumber')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getVendorList();
  }

  private getVendorList() {
    this.isGridLoading = true;
    const data = {
      ...this.vendorSearchParams
    };

    this.service.getVendors(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IVendorList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.vendorList = res.data;
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
      phoneNumber: '',
      alternatePhoneNumber: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.vendorSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getVendorList();
  }

  private setPagination() {
    this.vendorSearchParams = this.uiService.adjustPagination(this.vendorList, this.vendorSearchParams);
  }

  private changeStatus(vendorId: number, isActive: boolean): void {
    this.service.updateStatus(vendorId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IVendorObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getVendorList();
        }
      }
    });
  }

  private updateStatusConfirmation(vendorId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(vendorId, isActive); });
  }
  // #endregion
}
