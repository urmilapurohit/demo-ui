import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ProjectRoleService } from '../../services/project.role.service';
import { IProjectRoleList, IProjectRoleObject, IProjectRoleSearchParams } from '../../models/project.role';

@Component({
  selector: 'app-project-role',
  templateUrl: './project.role.component.html',
  styleUrl: './project.role.component.css'
})
export class ProjectRoleComponent implements OnInit, OnDestroy {
  // #region class Members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  projectRoleGridConfig!: DataGrid<IProjectRoleObject>;
  projectRoleList: IProjectRoleList | null = {} as IProjectRoleList;
  initialSearchParams: IProjectRoleSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  projectRoleSearchParams: IProjectRoleSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "abbreviation", title: "Abbreviation", customHeaderClassName: "abbreviation-column" },
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: ProjectRoleService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.projectRoleSearchParams = {
      ...this.projectRoleSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.projectRoleSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ProjectRole);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getProjectRoleList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }
  // #region class methods

  addProjectRole(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.ADD_PROJECT_ROLE_ABSOLUTE]);
  }

  getProjectRoleList() {
    this.isGridLoading = true;
    const data = {
      ...this.projectRoleSearchParams
    };

    this.service.getProjectRoles(data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectRoleList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.projectRoleList = res.data;
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

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Role', link: '' },
    ];
  }

  private setPagination() {
    this.projectRoleSearchParams = this.uiService.adjustPagination(this.projectRoleList, this.projectRoleSearchParams);
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name/Abbreviation',
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
    this.projectRoleGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IProjectRoleObject> => {
    const config: DataGrid<IProjectRoleObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.projectRoleSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.projectRoleSearchParams.pageSize,
      totalDataLength: this.projectRoleList?.totalRecords || 0,
      isNoRecordFound: !((this.projectRoleList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.projectRoleSearchParams = {
          ...this.projectRoleSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getProjectRoleList();
      },
      gridData: {
        data: this.projectRoleList?.records,
        dataSource: undefined
      },
      id: 'ProjectRoleGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.projectRoleSearchParams.pageNumber,
        pageSize: this.projectRoleSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.projectRoleSearchParams = {
            ...this.projectRoleSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getProjectRoleList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IProjectRoleObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IProjectRoleObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IProjectRoleObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.EDIT_PROJECT_ROLE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IProjectRoleObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
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
    this.projectRoleSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getProjectRoleList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.projectRoleSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getProjectRoleList();
  }

  private changeStatus(projectRoleId: number, isActive: boolean): void {
    this.service.updateStatus(projectRoleId, !isActive)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response: BaseResponseModel<IProjectRoleObject>) => {
          if (response.isSuccess) {
            this.globalService.openSnackBar(response?.message);
            this.setPagination();
            this.getProjectRoleList();
          }
        },
      });
  }

  private updateStatusConfirmation(projectRoleId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(projectRoleId, isActive); });
  }
  // #endregion
}
