import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ILookupCategoryDetailList, ILookupCategoryDetailObject, ILookupCategoryDetailSearchParams } from '../../models/lookup.category.detail';
import { LookupCategoryDetailService } from '../../services/lookup.category.detail.service';

@Component({
  selector: 'app-lookup-category-detail',
  templateUrl: './lookup.category.detail.component.html',
  styleUrl: './lookup.category.detail.component.css'
})
export class LookupCategoryDetailComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  lookupCategory!: DropDown;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: ILookupCategoryDetailSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    lookupCategoryId: 0,
    sortBy: 'Name',
    isActive: true
  };
  lookupCategoryDetailGridConfig!: DataGrid<ILookupCategoryDetailObject>;
  lookupCategoryDetailList: ILookupCategoryDetailList | null = {} as ILookupCategoryDetailList;
  lookupCategoryDetailSearchParams: ILookupCategoryDetailSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  lookupCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "lookupCategoryName", title: "Lookup Category", customHeaderClassName: "type-column" },
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "description", title: "Description", customHeaderClassName: "desc-column" },
    { field: "displayOrder", title: "Display Order", customHeaderClassName: "order-column" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: LookupCategoryDetailService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.lookupCategoryDetailSearchParams = {
      ...this.lookupCategoryDetailSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.lookupCategoryDetailSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.CategoryDetail);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.getLookupCategoryList();
    this.getLookupCategoryDetailList();
    this.setTableConfig();
    this.setButtonConfig();
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
      { label: 'Lookup Category Detail', link: '' },
    ];
  }

  addLookupCategoryDetail(): void {
    this.router.navigate([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.ADD_LOOKUP_CATEGORY_DETAIL_ABSOLUTE]);
  }

  private getLookupCategoryList() {
    this.uiService.getDropdownOptions(this.service.getLookupCategories(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.lookupCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      lookupCategory: 0,
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE],
    });
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private getLookupCategoryDetailList() {
    this.isGridLoading = true;
    const data = {
      ...this.lookupCategoryDetailSearchParams
    };

    this.service.getLookupCategoryDetails(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ILookupCategoryDetailList>) => {
        if (res.isSuccess && res.data) {
          this.lookupCategoryDetailList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
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

    this.lookupCategory = {
      data: {
        data: this.lookupCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'lookupCategory',
      formControlName: 'lookupCategory',
      label: 'Lookup Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.lookupCategoryDetailSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      lookupCategoryId: this.filterForm.get('lookupCategory')?.value
    };
    this.getLookupCategoryDetailList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      lookupCategory: 0
    });
    this.lookupCategoryDetailSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getLookupCategoryDetailList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.lookupCategoryDetailGridConfig = this.getGridConfig();
  }

  private getActionButtons(): DataGridActionButton<ILookupCategoryDetailObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ILookupCategoryDetailObject> = this.uiService.getEditActionButtonConfig(
        (data: DataGridFullRowData<ILookupCategoryDetailObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.EDIT_LOOKUP_CATEGORY_DETAIL_ABSOLUTE, data.rowData.id]);
          }
        },
        (data: ILookupCategoryDetailObject) => {
          return data.isEditable ?? true;
        }
      );
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<ILookupCategoryDetailObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData?.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private setPagination() {
    this.lookupCategoryDetailSearchParams = this.uiService.adjustPagination(this.lookupCategoryDetailList, this.lookupCategoryDetailSearchParams);
  }

  private changeStatus(lookupCategoryDetailId: number, isActive?: boolean): void {
    this.service.updateStatus(lookupCategoryDetailId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ILookupCategoryDetailObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getLookupCategoryDetailList();
        }
      }
    });
  }

  private updateStatusConfirmation(lookupCategoryDetailId: number, isActive?: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(lookupCategoryDetailId, isActive); });
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ILookupCategoryDetailObject> => {
    const config: DataGrid<ILookupCategoryDetailObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.lookupCategoryDetailSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.lookupCategoryDetailSearchParams.pageSize,
      totalDataLength: this.lookupCategoryDetailList?.totalRecords || 0,
      isNoRecordFound: !((this.lookupCategoryDetailList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.lookupCategoryDetailSearchParams = {
          ...this.lookupCategoryDetailSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getLookupCategoryDetailList();
      },
      gridData: {
        data: this.lookupCategoryDetailList?.records,
        dataSource: undefined
      },
      id: 'LookupCategoryDetailGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.lookupCategoryDetailSearchParams.pageNumber,
        pageSize: this.lookupCategoryDetailSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.lookupCategoryDetailSearchParams = {
            ...this.lookupCategoryDetailSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getLookupCategoryDetailList();
        }
      }
    };
    return config;
  };
  // #endregion
}
