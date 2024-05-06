import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { TypeService } from '../../services/type.service';
import { IProjectTypeList, IProjectTypeObject, IProjectTypeSearchParams } from '../../models/type';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrl: './type.component.css'
})
export class TypeComponent implements OnInit, OnDestroy {
  // #region class Members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  projectTypeGridConfig!: DataGrid<IProjectTypeObject>;
  projectTypeList: IProjectTypeList | null = {} as IProjectTypeList;
  initialSearchParams: IProjectTypeSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  projectTypeSearchParams: IProjectTypeSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "displayOrder", title: "Display Order", fieldDataType: DataGridFieldDataType.number, customHeaderClassName: "order-column" },
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: TypeService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.projectTypeSearchParams = {
      ...this.projectTypeSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.projectTypeSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ProjectType);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getProjectTypeList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  addProjectType(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.ADD_TYPE_ABSOLUTE]);
  }

  getProjectTypeList() {
    this.isGridLoading = true;
    const data = {
      ...this.projectTypeSearchParams
    };

    this.service.getProjectTypes(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectTypeList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.projectTypeList = res.data;
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
    this.projectTypeSearchParams = this.uiService.adjustPagination(this.projectTypeList, this.projectTypeSearchParams);
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Type ', link: '' },
    ];
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

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.projectTypeGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IProjectTypeObject> => {
    const config: DataGrid<IProjectTypeObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.projectTypeSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.projectTypeSearchParams.pageSize,
      totalDataLength: this.projectTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.projectTypeList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.projectTypeSearchParams = {
          ...this.projectTypeSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getProjectTypeList();
      },
      gridData: {
        data: this.projectTypeList?.records,
        dataSource: undefined
      },
      id: 'ProjectTypeGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.projectTypeSearchParams.pageNumber,
        pageSize: this.projectTypeSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.projectTypeSearchParams = {
            ...this.projectTypeSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getProjectTypeList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IProjectTypeObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IProjectTypeObject> = this.uiService.getEditActionButtonConfig(
        (data: DataGridFullRowData<IProjectTypeObject>) => {
          if (data?.rowData?.id) {
            this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.EDIT_TYPE_ABSOLUTE, data.rowData.id]);
          }
        },
        (data: IProjectTypeObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig(
        (data: DataGridFullRowData<IProjectTypeObject>) => {
          if (data?.rowData?.id) {
            this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
          }
        },
        (data: IProjectTypeObject) => {
          return !data.isDefault;
        }
      );
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.projectTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getProjectTypeList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.projectTypeSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getProjectTypeList();
  }

  private changeStatus(id: number, isActive: boolean): void {
    this.service.updateStatus(id, !isActive)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response: BaseResponseModel<IProjectTypeObject>) => {
          if (response.isSuccess) {
            this.globalService.openSnackBar(response?.message);
            this.setPagination();
            this.getProjectTypeList();
          }
        },
      });
  }

  private updateStatusConfirmation(id: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(id, isActive); });
  }
  // #endregion
}
