import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ITechnologyList, ITechnologyObject, ITechnologySearchParams } from '../../models/technology.model';
import { TechnologyService } from '../../services/technology.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.css'
})
export class TechnologyComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: ITechnologySearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name'
  };
  technologyGridConfig!: DataGrid<ITechnologyObject>;
  technologyList: ITechnologyList | null = {} as ITechnologyList;
  technologySearchParams: ITechnologySearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    {
      field: "name",
      title: "Name",
      customHeaderClassName: 'name-column'
    },
    {
      field: "displayOrder",
      title: "Display Order",
      fieldDataType: DataGridFieldDataType.number,
      customHeaderClassName: 'order-column'
    }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: TechnologyService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.technologySearchParams = {
      ...this.technologySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.technologySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.PreSalesTechnology);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getTechnologyList();
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
      { label: 'Pre-Sales', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Technology', link: '' }
    ];
  }

  addTechnology(): void {
    this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.ADD_TECHNOLOGY_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
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
    this.technologyGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<ITechnologyObject> => {
    const config: DataGrid<ITechnologyObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.technologySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.technologySearchParams.pageSize,
      totalDataLength: this.technologyList?.totalRecords || 0,
      isNoRecordFound: !((this.technologyList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.technologySearchParams = {
          ...this.technologySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getTechnologyList();
      },
      gridData: {
        data: this.technologyList?.records,
        dataSource: undefined
      },
      id: 'technologyGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.technologySearchParams.pageNumber,
        pageSize: this.technologySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.technologySearchParams = {
            ...this.technologySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getTechnologyList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<ITechnologyObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ITechnologyObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ITechnologyObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.EDIT_TECHNOLOGY_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton: DataGridActionButton<ITechnologyObject> = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<ITechnologyObject>) => {
        if (data?.rowData?.id) {
          this.deleteTechnologyRequest(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private getTechnologyList() {
    this.isGridLoading = true;
    const data = {
      ...this.technologySearchParams
    };

    this.service.getTechnologies(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITechnologyList>) => {
        if (res.isSuccess && res.data) {
          this.technologyList = res.data;
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
    this.technologySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getTechnologyList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.technologySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value
    };
    this.getTechnologyList();
  }

  private deleteTechnologyRequest(technologyId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this technology?",
      () => {
        this.deleteTechnology(technologyId);
      }
    );
  }

  private setPagination() {
    this.technologySearchParams = this.uiService.adjustPagination(this.technologyList, this.technologySearchParams);
  }

  private deleteTechnology(technologyId: number): void {
    this.service.deleteTechnology(technologyId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ITechnologyObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getTechnologyList();
        }
      }
    });
  }
  // #endregion
}
