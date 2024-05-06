import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoComplete, BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFullRowData, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { Router } from '@angular/router';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { GeneralService } from '@services/general.service';
import { Subject, takeUntil } from 'rxjs';
import { IMemberRoleList, IMemberRoleObject, IMemberRoleSearchParams } from '../../models/member.role.model';
import { MemberRoleService } from '../../services/member.role.service';

@Component({
  selector: 'app-member-role',
  templateUrl: './member.role.component.html',
  styleUrl: './member.role.component.css'
})
export class MemberRoleComponent implements OnInit, OnDestroy {
  // #region initialize variables
  memberName!: AutoComplete;
  status!: DropDown;
  designationDropDown!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IMemberRoleSearchParams = {
    ...DEFAULT_PAGINATION,
    designationId: 0,
    memberName: '',
    isActive: true,
    sortBy: 'MemberName'
  };
  memberGridConfig!: DataGrid<IMemberRoleObject>;
  memberRoleList: IMemberRoleList | null = {} as IMemberRoleList;
  memberRoleSearchParams: IMemberRoleSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  designationOptions!: DropdownValue[];
  memberOptions!: DropdownValue[];
  resetSorting = false;
  tableColumns: any[] = [
    { field: "memberName", title: "Name", customHeaderClassName: "employee-name-column" },
    { field: "memberDesignation", title: "Role", customHeaderClassName: "employee-role-column" },
    {
      field: "isBde",
      title: "Is BDE?",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: "emp-role-column"
    },
    {
      field: "isBa",
      title: "Is BA?",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: "emp-role-column"
    },
    {
      field: "isPreSalesAdmin",
      title: "Is Admin ?",
      fieldDataType: DataGridFieldDataType.boolean,
      customHeaderClassName: "emp-role-column"
    },
    {
      field: "onedrivePath",
      title: "One Drive Path",
      customHeaderClassName: "onedrive-path-column",
    }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: MemberRoleService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService,
    private generalService: GeneralService,
  ) {
    this.memberRoleSearchParams = {
      ...this.memberRoleSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.memberRoleSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.PreSalesMemberRole);
  }
  // #endregion

  ngOnInit() {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setDropDownConfig();
    this.getMembers();
    this.getDesignations();
    this.setButtonConfig();
    this.setTableConfig();
    this.getMemberRoleList();
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
      { label: 'Member Role', link: '' }
    ];
  }

  addMemberRole(): void {
    this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.ADD_MEMBER_ROLE_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      memberName: [""],
      designation: ["", [Validators.required]],
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE],
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
    this.memberName = {
      label: 'Name',
      formControlName: 'memberName',
      options: this.memberOptions?.map((x) => x.text),
      placeholder: "",
      customFormFieldClass: 'custom-form-group sm-form-group',
    };
  };

  private setDropDownConfig = (): void => {
    this.designationDropDown = {
      data: {
        data: this.designationOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'designation',
      formControlName: 'designation',
      label: 'Designation',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private getDesignations() {
    this.uiService.getDropdownOptions(this.service.getDesignations(), true, { id: "", text: 'Select Designation' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.designationOptions = data;
        this.setDropDownConfig();
      }
    });
  }

  private getMembers() {
    this.uiService.getDropdownOptions(this.generalService.getMembers(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.memberOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.memberGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IMemberRoleObject> => {
    const config: DataGrid<IMemberRoleObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.memberRoleSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.memberRoleSearchParams.pageSize,
      totalDataLength: this.memberRoleList?.totalRecords || 0,
      isNoRecordFound: !((this.memberRoleList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.memberRoleSearchParams = {
          ...this.memberRoleSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getMemberRoleList();
      },
      gridData: {
        data: this.memberRoleList?.records,
        dataSource: undefined
      },
      id: 'DepartmentGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'memberId' },
        pageNumber: this.memberRoleSearchParams.pageNumber,
        pageSize: this.memberRoleSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.memberRoleSearchParams = {
            ...this.memberRoleSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getMemberRoleList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IMemberRoleObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IMemberRoleObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IMemberRoleObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.EDIT_MEMBER_ROLE_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IMemberRoleObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private getMemberRoleList() {
    this.isGridLoading = true;
    const data = {
      ...this.memberRoleSearchParams
    };

    this.service.getMemberRoles(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IMemberRoleList>) => {
        if (res.isSuccess && res.data) {
          this.memberRoleList = res.data;
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
      memberName: "",
      designation: "",
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.memberRoleSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getMemberRoleList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ memberName: this.filterForm.get('memberName')?.value.trim() });
    this.memberRoleSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      designationId: this.filterForm.get('designation')?.value || 0,
      memberName: this.filterForm.get('memberName')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getMemberRoleList();
  }

  private setPagination() {
    this.memberRoleSearchParams = this.uiService.adjustPagination(this.memberRoleList, this.memberRoleSearchParams);
  }

  private changeStatus(memberRoleId: number, isActive: boolean): void {
    this.service.updateStatus(memberRoleId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IMemberRoleObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getMemberRoleList();
        }
      }
    });
  }

  private updateStatusConfirmation(memberRoleId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(memberRoleId, isActive); });
  }
  // #endregion
}
