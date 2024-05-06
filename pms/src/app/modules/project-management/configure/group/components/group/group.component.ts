import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFieldType, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IProjectGroupList, IProjectGroupObject, IProjectGroupSearchParams } from '../../models/group';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit, OnDestroy {
  // #region class members
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  projectGroupGridConfig!: DataGrid<IProjectGroupObject>;
  projectGroupList: IProjectGroupList | null = {} as IProjectGroupList;
  filterForm!: FormGroup;
  initialSearchParams: IProjectGroupSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    isActive: true,
    sortBy: 'Name'
  };
  projectGroupSearchParams: IProjectGroupSearchParams = { ...this.initialSearchParams };
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    public dialogRef: MatDialog,
    private service: GroupService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService,
  ) {
    this.projectGroupSearchParams = {
      ...this.projectGroupSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.projectGroupSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ProjectGroup);
  }
  // #endregion
  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getProjectGroupList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  addProjectGroup(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.ADD_GROUP_ABSOLUTE]);
  }

  getProjectGroupList() {
    this.isGridLoading = true;
    const data = {
      ...this.projectGroupSearchParams
    };

    this.service.getProjectGroups(data)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res: BaseResponseModel<IProjectGroupList>) => {
        if (res.isSuccess) {
          if (res.data) {
            this.projectGroupList = res.data;
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
    this.projectGroupSearchParams = this.uiService.adjustPagination(this.projectGroupList, this.projectGroupSearchParams);
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
      { label: 'Group', link: '' },
    ];
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name/Description',
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
    this.projectGroupGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IProjectGroupObject> => {
    const config: DataGrid<IProjectGroupObject> = {
      actionButtons: this.getActionButtons(),
      columns: [
        {
          field: "name",
          title: "Name",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          style: { width: 25 },
          customHeaderClassName: "name-column"
        },
        {
          field: "description",
          title: "Description",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "desc-column"
        }
      ],
      pageIndex: this.projectGroupSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.projectGroupSearchParams.pageSize,
      totalDataLength: this.projectGroupList?.totalRecords || 0,
      isNoRecordFound: !((this.projectGroupList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.projectGroupSearchParams = {
          ...this.projectGroupSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getProjectGroupList();
      },
      gridData: {
        data: this.projectGroupList?.records,
        dataSource: undefined
      },
      id: 'ProjectGroupGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.projectGroupSearchParams.pageNumber,
        pageSize: this.projectGroupSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.projectGroupSearchParams = {
            ...this.projectGroupSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getProjectGroupList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IProjectGroupObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IProjectGroupObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IProjectGroupObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.EDIT_GROUP_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IProjectGroupObject>) => {
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
      searchDescription: '',
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.projectGroupSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getProjectGroupList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.projectGroupSearchParams = {
      ...this.initialSearchParams,
      pageSize: DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getProjectGroupList();
  }

  private changeStatus(projectGroupId: number, isActive: boolean): void {
    this.service.updateStatus(projectGroupId, !isActive)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (response: BaseResponseModel<IProjectGroupObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getProjectGroupList();
        }
      },
    });
  }

  private updateStatusConfirmation(projectGroupId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(projectGroupId, isActive); });
  }
  // #endregion
}
