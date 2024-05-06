import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, ButtonType, ButtonVariant, DataGrid, DataGridActionButton, DataGridFullRowData, GlobalService, InputType, TextField, TooltipDirection } from 'workspace-library';
import { Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IApplicationConfigurationList, IApplicationConfigurationObject, IApplicationConfigurationSearchParams } from '../../models/application.configuration';
import { ApplicationConfigurationService } from '../../services/application.configuration.service';

@Component({
  selector: 'app-application.configuration',
  templateUrl: './application.configuration.component.html',
  styleUrl: './application.configuration.component.css'
})
export class ApplicationConfigurationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  resetCacheBtnConfig!: Button;
  initialSearchParams: IApplicationConfigurationSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name'
  };
  applicationConfigurationGridConfig!: DataGrid<IApplicationConfigurationObject>;
  applicationConfigurationList: IApplicationConfigurationList | null = {} as IApplicationConfigurationList;
  applicationConfigurationSearchParams: IApplicationConfigurationSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: 'appconfig-name-column' },
    { field: "description", title: "Description", customHeaderClassName: 'appconfig-description-column' },
    { field: "configValue", title: "Configuration Value", customHeaderClassName: 'appconfig-config-column' },
    { field: "dataType", title: "Data Type", customHeaderClassName: 'appconfig-datatype-column' }
  ];
  private ngUnsubscribe$ = new Subject<void>();

  // #endregion

  // #region constructor
  constructor(
    private service: ApplicationConfigurationService,
    private fb: FormBuilder,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService,
    private globalService: GlobalService
  ) {
    this.applicationConfigurationSearchParams = {
      ...this.applicationConfigurationSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.applicationConfigurationSearchParams.pageSize
    };

    this.pagePermissions = this.permissionService.checkAllPermission(Pages.ApplicationConfiguration);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getApplicationConfigurationList();
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
      { label: 'Application Configuration', link: '' }
    ];
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""]
    });
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name/Description',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    this.resetCacheBtnConfig = {
      id: 'resetBtnPageHeader',
      buttonText: "Reset Cache",
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.iconWithText,
      className: 'primary-border-btn',
      imgUrl: '../../../../assets/images/reset-cache-icon.svg',
      customWidthClass: '',
      tooltip: "",
      tooltipDirection: TooltipDirection.left,
      tooltipClass: 'custom-tooltip left-pos',
      callback: () => { this.resetApplicationConfigurationCache(); },
    };
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.applicationConfigurationGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }
  private getGridConfig = (): DataGrid<IApplicationConfigurationObject> => {
    const config: DataGrid<IApplicationConfigurationObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.applicationConfigurationSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.applicationConfigurationSearchParams.pageSize,
      totalDataLength: this.applicationConfigurationList?.totalRecords || 0,
      isNoRecordFound: !((this.applicationConfigurationList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.applicationConfigurationSearchParams = {
          ...this.applicationConfigurationSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getApplicationConfigurationList();
      },
      gridData: {
        data: this.applicationConfigurationList?.records,
        dataSource: undefined
      },
      id: 'ApplicationConfigurationGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
        pageNumber: this.applicationConfigurationSearchParams.pageNumber,
        pageSize: this.applicationConfigurationSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.applicationConfigurationSearchParams = {
            ...this.applicationConfigurationSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getApplicationConfigurationList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IApplicationConfigurationObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IApplicationConfigurationObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IApplicationConfigurationObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.APPLICATION_CONFIGURATION.EDIT_APPLICATION_CONFIGURATION_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    return actionsButton;
  }

  private resetApplicationConfigurationCache() {
    this.isGridLoading = true;
    this.service.resetApplicationConfigurationCache().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.isGridLoading = false;
          this.globalService.openSnackBar(res.message);
        }
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private getApplicationConfigurationList() {
    this.isGridLoading = true;
    const data = {
      ...this.applicationConfigurationSearchParams
    };

    this.service.getApplicationConfiguration(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IApplicationConfigurationList>) => {
        if (res.isSuccess && res.data) {
          this.applicationConfigurationList = res.data;
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
      searchName: '',
    });
    this.applicationConfigurationSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getApplicationConfigurationList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.applicationConfigurationSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
    };
    this.getApplicationConfigurationList();
  }
  // #endregion
}
