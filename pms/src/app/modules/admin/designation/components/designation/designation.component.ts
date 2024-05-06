import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IDesignationList, IDesignationObject, IDesignationSearchParams } from '../../models/designation';
import { DesignationService } from '../../services/designation.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IDesignationSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    abbreviation: '',
    sortBy: 'Name'
  };
  designationGridConfig!: DataGrid<IDesignationObject>;
  designationList: IDesignationList | null = {} as IDesignationList;
  designationSearchParams: IDesignationSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
    { field: "abbreviation", title: "Abbreviation", customHeaderClassName: "abbreviation-column" },
    { field: "canBeProjectMember", title: "Can Be Project Member", customHeaderClassName: "yes-no-column" },
    { field: "canBeAssessor", title: "Can Be Assessor", customHeaderClassName: "yes-no-column" },
    { field: "canBeReviewer", title: "Can Be Reviewer", customHeaderClassName: "yes-no-column" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: DesignationService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.designationSearchParams = {
      ...this.designationSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.designationSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Designation);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getDesignationList();
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
      { label: 'Designation', link: '' }
    ];
  }

  addDesignation(): void {
    this.router.navigate([ROUTES.ADMIN.DESIGNATION.ADD_DESIGNATION_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""]
    });
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name/Abbreviation',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
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
    this.designationGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IDesignationObject> => {
    const config: DataGrid<IDesignationObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.designationSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.designationSearchParams.pageSize,
      totalDataLength: this.designationList?.totalRecords || 0,
      isNoRecordFound: !((this.designationList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.designationSearchParams = {
          ...this.designationSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getDesignationList();
      },
      gridData: {
        data: this.designationList?.records,
        dataSource: undefined
      },
      id: 'DesignationGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.designationSearchParams.pageNumber,
        pageSize: this.designationSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.designationSearchParams = {
            ...this.designationSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getDesignationList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IDesignationObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IDesignationObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IDesignationObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.DESIGNATION.EDIT_DESIGNATION_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<IDesignationObject>) => {
        if (data?.rowData?.id) {
          this.deleteDesignationConfirmation(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private getDesignationList() {
    this.isGridLoading = true;
    const data = {
      ...this.designationSearchParams
    };

    this.service.getDesignation(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDesignationList>) => {
        if (res.isSuccess && res.data) {
          this.designationList = res.data;
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

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: ''
    });
    this.designationSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getDesignationList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.designationSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
    };
    this.getDesignationList();
  }

  private deleteDesignationConfirmation(designationId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this designation?",
      () => {
        this.delete(designationId);
      }
    );
  }

  private setPagination() {
    this.designationSearchParams = this.uiService.adjustPagination(this.designationList, this.designationSearchParams);
  }

  private delete(designationId: number): void {
    this.service.deleteDesignation(designationId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IDesignationObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getDesignationList();
        }
      }
    });
  }
  // #endregion
}
