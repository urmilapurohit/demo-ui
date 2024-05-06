import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { DEFAULT_PAGINATION, EDIT_STATUS_LABEL, EDIT_STATUS_OPTIONS, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { LookupCategoryService } from '../../services/lookup.category.service';
import { ILookupCategoryList, ILookupCategoryObject, ILookupCategorySearchParams } from '../../models/lookup.category';

@Component({
  selector: 'app-lookup.category',
  templateUrl: './lookup.category.component.html',
  styleUrl: './lookup.category.component.css'
})
export class LookupCategoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  editable!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: ILookupCategorySearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isEditable: true,
    sortBy: 'Name'
  };
  lookupCategoryGridConfig!: DataGrid<ILookupCategoryObject>;
  lookupCategoryList: ILookupCategoryList | null = {} as ILookupCategoryList;
  lookupCategorySearchParams: ILookupCategorySearchParams = { ...this.initialSearchParams, sortBy: 'Name' };
  filterForm!: FormGroup;
  pagePermissions: PageAccessPermission;
  isGridLoading: boolean = false;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: LookupCategoryService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.lookupCategorySearchParams = {
      ...this.lookupCategorySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.lookupCategorySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Category);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getLookupCategoryList();
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
      { label: 'Lookup Category', link: '' },
    ];
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      editable: [EDIT_STATUS_LABEL.EDITABLE]
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
    this.editable = {
      data: {
        data: EDIT_STATUS_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'editable',
      formControlName: 'editable',
      label: 'Editable',
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
      editable: EDIT_STATUS_LABEL.EDITABLE
    });
    this.lookupCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getLookupCategoryList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.lookupCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isEditable: this.filterForm.get('editable')?.value === EDIT_STATUS_LABEL.EDITABLE
    };
    this.getLookupCategoryList();
  }

  private getLookupCategoryList() {
    this.isGridLoading = true;
    const data = {
      ...this.lookupCategorySearchParams
    };

    this.service.getLookupCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ILookupCategoryList>) => {
        if (res.isSuccess && res.data) {
          this.lookupCategoryList = res.data;
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

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.lookupCategoryGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<ILookupCategoryObject> => {
    const config: DataGrid<ILookupCategoryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.lookupCategorySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.lookupCategorySearchParams.pageSize,
      totalDataLength: this.lookupCategoryList?.totalRecords || 0,
      isNoRecordFound: !((this.lookupCategoryList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.lookupCategorySearchParams = {
          ...this.lookupCategorySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getLookupCategoryList();
      },
      gridData: {
        data: this.lookupCategoryList?.records,
        dataSource: undefined
      },
      id: 'LookupCategoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.lookupCategorySearchParams.pageNumber,
        pageSize: this.lookupCategorySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.lookupCategorySearchParams = {
            ...this.lookupCategorySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getLookupCategoryList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ILookupCategoryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      actionsButton.push(
        {
          btnImageSrc: 'assets/images/editable.svg',
          btnAlternateSrc: 'assets/images/non-editable.svg',
          btnType: ButtonType.img,
          tooltip: 'Make Non-Editable',
          isBooleanBtn: true,
          booleanField: 'isEditable',
          alterTooltip: 'Make Editable',
          className: 'action-item table-icon-btn',
          callback: (data: DataGridFullRowData<ILookupCategoryObject>) => {
            if (data?.rowData?.id) {
              this.updateEditConfiguration(Number(data.rowData.id), data.rowData.isEditable);
            }
          }
        }
      );
    }
    return actionsButton;
  }

  private setPagination() {
    this.lookupCategorySearchParams = this.uiService.adjustPagination(this.lookupCategoryList, this.lookupCategorySearchParams);
  }

  private updateEditConfiguration(lookupCategoryId: number, isEditable?: boolean): void {
    const dialog = this.globalService.getConfirmDialog({
      bodyMessage: 'Are you sure you want to change the status of editable?',
      title: GLOBAL_CONSTANTS.CONFIRMATION,
      showConfirmBtn: true,
      confirmBtnName: GLOBAL_CONSTANTS.CONFIRM,
      confirmCallBackAction: 'yes',
      showCancelBtn: true,
      cancelBtnName: 'Cancel',
      cancelCallBackAction: 'no'
    });
    dialog.afterClosed().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: { data: string }) => {
      if (res?.data === 'yes') {
        this.service.updateEditableStatus(lookupCategoryId, !isEditable).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (response: BaseResponseModel<ILookupCategoryObject>) => {
            if (response.isSuccess) {
              this.globalService.openSnackBar(response?.message);
              this.setPagination();
              this.getLookupCategoryList();
            }
          }
        });
      }
    });
  }
  // #endregion
}
