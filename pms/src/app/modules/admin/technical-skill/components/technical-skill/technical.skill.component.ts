import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { TechnicalSkillService } from '../../services/technical.skill.service';
import { ITechnicalSkillList, ITechnicalSkillObject, ITechnicalSkillSearchParams } from '../../models/technical.skill';

@Component({
  selector: 'app-technical-skill',
  templateUrl: './technical.skill.component.html',
  styleUrl: './technical.skill.component.css'
})
export class TechnicalSkillComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: ITechnicalSkillSearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name',
    isActive: true
  };
  technicalSkillGridConfig!: DataGrid<ITechnicalSkillObject>;
  technicalSkillList: ITechnicalSkillList | null = {} as ITechnicalSkillList;
  technicalSkillSearchParams: ITechnicalSkillSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  breadcrumbItems: BreadcrumbItem[] = [];
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "name", title: "Skill Name", customHeaderClassName: "name-column" },
    { field: "abbreviation", title: "Abbreviation", customHeaderClassName: "abbreviation-column" }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: TechnicalSkillService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.technicalSkillSearchParams = {
      ...this.technicalSkillSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.technicalSkillSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.TechnicalSkill);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.setTableConfig();
    this.getTechnicalSkillList();
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
      { label: 'Technical Skills', link: '' },
    ];
  }

  addTechnicalSkill(): void {
    this.router.navigate([ROUTES.ADMIN.TECHNICAL_SKILL.ADD_TECHNICAL_SKILL_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
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

    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.technicalSkillSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getTechnicalSkillList();
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
    this.technicalSkillGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<ITechnicalSkillObject> => {
    const config: DataGrid<ITechnicalSkillObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.technicalSkillSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.technicalSkillSearchParams.pageSize,
      totalDataLength: this.technicalSkillList?.totalRecords || 0,
      isNoRecordFound: !((this.technicalSkillList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.technicalSkillSearchParams = {
          ...this.technicalSkillSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getTechnicalSkillList();
      },
      gridData: {
        data: this.technicalSkillList?.records,
        dataSource: undefined
      },
      id: 'TechnicalSkillGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.technicalSkillSearchParams.pageNumber,
        pageSize: this.technicalSkillSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.technicalSkillSearchParams = {
            ...this.technicalSkillSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getTechnicalSkillList();
        }
      }
    };
    return config;
  };

  private getTechnicalSkillList() {
    this.isGridLoading = true;
    const data = {
      ...this.technicalSkillSearchParams
    };

    this.service.getTechnicalSkills(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITechnicalSkillList>) => {
        if (res.isSuccess && res.data) {
          this.technicalSkillList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private getActionButtons(): DataGridActionButton<ITechnicalSkillObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ITechnicalSkillObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ITechnicalSkillObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.TECHNICAL_SKILL.EDIT_TECHNICAL_SKILL_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<ITechnicalSkillObject>) => {
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
    this.technicalSkillSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getTechnicalSkillList();
  }

  private changeStatus(technicalSkillId: number, isActive: boolean): void {
    this.service.updateStatus(technicalSkillId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ITechnicalSkillObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getTechnicalSkillList();
        }
      }
    });
  }

  private updateStatusConfirmation(technicalSkillId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(technicalSkillId, isActive); });
  }

  private setPagination() {
    this.technicalSkillSearchParams = this.uiService.adjustPagination(this.technicalSkillList, this.technicalSkillSearchParams);
  }
  // #endregion
}
