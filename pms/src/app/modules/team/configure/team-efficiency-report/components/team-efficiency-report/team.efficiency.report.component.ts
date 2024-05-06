import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Button, DataGrid, GlobalService, BaseResponseModel, DataGridFieldDataType, DataGridFieldType, DropDown, DropdownValue } from 'workspace-library';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { TeamEfficiencyReportService } from '../../services/team.efficiency.report.service';
import { ITeamEfficiencyReportObject } from '../../models/team.efficiency.report';

@Component({
  selector: 'app-team.efficiency.report',
  templateUrl: './team.efficiency.report.component.html',
  styleUrl: './team.efficiency.report.component.css'
})
export class TeamEfficiencyReportComponent implements OnInit, OnDestroy {
  // #region initialize variables
  projectManager!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  saveBtnConfig!: Button;
  teamEfficiencyReportGridConfig!: DataGrid<ITeamEfficiencyReportObject>;
  teamEfficiencyReportList: ITeamEfficiencyReportObject[] = [];
  filterForm!: FormGroup;
  tableForm!: FormGroup;
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  submitted = false;
  projectManagerList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  tableColumns: any[] = [
    { field: "fullName", title: "Employee Name", isSortable: false },
    { field: "reportingMemberName", title: "Reporting Person Name", isSortable: false },
    { field: "designation", title: "Designation", isSortable: false }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: TeamEfficiencyReportService,
    private fb: FormBuilder,
    public globalService: GlobalService,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.TeamEfficiencyReport);
  }
  // #endregion
  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.getProjectManagerList();
    this.setTableConfig();
    this.getTeamEfficiencyReportList();
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
      { label: 'Team', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Efficiency Report', link: '' },
    ];
  }

  private getProjectManagerList() {
    this.uiService.getDropdownOptions(this.service.getProjectManagers(), true, { id: '', text: 'Select Project Manager' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.projectManagerList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      projectManager: ["", [Validators.required]]
    });
    this.tableForm = this.fb?.group({});
  }

  private setTextBoxConfig = (): void => {
    this.projectManager = {
      data: {
        data: this.projectManagerList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'projectManager',
      formControlName: 'projectManager',
      label: 'Project Manager',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); },
      isRequired: true
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    this.saveBtnConfig = this.uiService.getSaveButtonConfig(() => this.onSave());
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.teamEfficiencyReportGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    columnData.push({
      field: 'isMainGroupInTer',
      title: 'Main Group in TER',
      fieldDataType: DataGridFieldDataType.boolean,
      fieldType: DataGridFieldType.data,
      isSortable: false,
      editConfig: {
        isEditable: true,
        controlType: 'checkbox',
        idFieldKey: 'memberId',
        label: "",
        needToShowBasedOn: 'FormControl',
        checkboxChange: this.onChangeMain,
      }
    });
    columnData.push({
      field: 'isSubGroupInTer',
      title: 'Sub Group in TER',
      fieldDataType: DataGridFieldDataType.boolean,
      fieldType: DataGridFieldType.data,
      isSortable: false,
      editConfig: {
        isEditable: true,
        controlType: 'checkbox',
        idFieldKey: 'memberId',
        label: "",
        needToShowBasedOn: 'FormControl',
        checkboxChange: this.onChangeSub,
      }
    });
    columnData.push({
      field: 'canFillTer',
      title: 'Can fill TER',
      fieldDataType: DataGridFieldDataType.boolean,
      fieldType: DataGridFieldType.data,
      isSortable: false,
      editConfig: {
        isEditable: true,
        controlType: 'checkbox',
        idFieldKey: 'memberId',
        label: "",
        needToShowBasedOn: 'FormControl',
        checkboxChange: () => { }
      }
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ITeamEfficiencyReportObject> => {
    const config: DataGrid<ITeamEfficiencyReportObject> = {
      formGroup: this.tableForm,
      columns: this.setTableColumns(),
      gridData: {
        data: this.teamEfficiencyReportList,
        dataSource: undefined
      },
      id: 'teamEfficiencyReportGrid',
      idFieldKey: 'memberId',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
      pageIndex: 0
    };
    return config;
  };

  private onChangeMain = (data: MatCheckboxChange, formControlName: string | undefined): void => {
    const id = formControlName?.split('_')[1];
    if (data.checked) {
      const subGrpControl = this.tableForm.get(`isSubGroupInTer_${id}`);
      const canFillTerControl = this.tableForm.get(`canFillTer_${id}`);
      if (subGrpControl) {
        subGrpControl.setValue(false);
      }
      if (canFillTerControl) {
        canFillTerControl.setValue(true);
      }
    }
    this.toggleAssociatedCheckboxes(Number(id), data.checked);
  };

  private onChangeSub = (data: MatCheckboxChange, formControlName: string | undefined): void => {
    const id = formControlName?.split('_')[1];
    if (data.checked) {
      const mainGrpControl = this.tableForm.get(`isMainGroupInTer_${id}`);
      if (mainGrpControl) {
        mainGrpControl.setValue(false);
      }
    }
    this.toggleAssociatedCheckboxes(Number(id), false);
  };

  private onAfterGridSet() {
    const processedEmployees = new Set<number>();
    this.teamEfficiencyReportList.forEach((emp) => {
      this.toggleAssociatedCheckboxes(emp.memberId, emp.isMainGroupInTer, processedEmployees);
    });
  }

  private handleCanFillTer(id: number) {
    const mainGrpControl = this.tableForm.get(`isMainGroupInTer_${id}`);
    const subGrpControl = this.tableForm.get(`isSubGroupInTer_${id}`);
    const canFillControl = this.tableForm.get(`canFillTer_${id}`);

    if (mainGrpControl && subGrpControl && canFillControl) {
      if (!mainGrpControl.value && !subGrpControl.value) {
        canFillControl.disable();
        canFillControl.setValue(false);
      } else {
        canFillControl.enable();
      }
      if (mainGrpControl.value) {
        canFillControl.disable();
        canFillControl.setValue(true);
      }
    }
  }

  private toggleAssociatedCheckboxes(employeeId: number, enable: boolean, processedEmployees?: Set<number>): void {
    if (processedEmployees?.has(employeeId)) {
      return; // Already processed this employee, exit recursion
    }

    processedEmployees?.add(employeeId); // Mark the current employee as processed

    this.handleCanFillTer(employeeId);

    const associatedEmployees = this.teamEfficiencyReportList.filter((emp) => emp.reportingToMemberId === employeeId);

    associatedEmployees.forEach((emp) => {
      const mainGrpControl = this.tableForm.get(`isMainGroupInTer_${emp.memberId}`);
      const subGrpControl = this.tableForm.get(`isSubGroupInTer_${emp.memberId}`);
      if (mainGrpControl && subGrpControl) {
        if (enable) {
          mainGrpControl.enable();
          subGrpControl.enable();
        } else {
          mainGrpControl.disable();
          subGrpControl.disable();
          mainGrpControl.setValue(false);
          subGrpControl.setValue(false);
        }
        this.handleCanFillTer(emp.memberId);
      }

      this.toggleAssociatedCheckboxes(emp.memberId, emp.isMainGroupInTer, processedEmployees); // Recursively call for associated members
    });
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.submitted = true;
    this.getTeamEfficiencyReportList();
  }

  private getTeamEfficiencyReportList() {
    if (this.filterForm.valid) {
      this.isGridLoading = true;
      const id = this.filterForm.get('projectManager')?.value;
      this.service.getTeamEfficiencyReport(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ITeamEfficiencyReportObject[]>) => {
          if (res.isSuccess && res.data) {
            this.teamEfficiencyReportList = res.data;
            this.removeAllControls();
            this.teamEfficiencyReportList.forEach((element) => {
              this.tableForm.addControl(
                `isMainGroupInTer_${element.memberId}`,
                new FormControl({ value: element.isMainGroupInTer, disabled: false })
              );
              this.tableForm.addControl(
                `isSubGroupInTer_${element.memberId}`,
                new FormControl({ value: element.isSubGroupInTer, disabled: false })
              );
              this.tableForm.addControl(
                `canFillTer_${element.memberId}`,
                new FormControl({ value: element.canFillTer, disabled: false })
              );
            });
            this.setTableConfig();
            this.onAfterGridSet();
          }
          this.isGridLoading = false;
        },
        error: () => {
          this.isGridLoading = false;
        }
      });
    }
  }

  private removeAllControls() {
    Object.keys(this.tableForm.controls).forEach((controlName) => {
      if (this.tableForm.controls[controlName]) {
        this.tableForm.removeControl(controlName);
      }
    });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.submitted = false;
    this.filterForm.patchValue({
      projectManager: ''
    });
    this.teamEfficiencyReportList = [];
    this.getTeamEfficiencyReportList();
  }

  onSave() {
    if (this.pagePermissions.isEditPermission) {
      const req = this.teamEfficiencyReportList.map((report) => {
        return {
          id: report.memberId,
          reportConfiguration: {
            isMainGroupInTer: this.tableForm.get(`isMainGroupInTer_${report.memberId}`)?.value,
            isSubGroupInTer: this.tableForm.get(`isSubGroupInTer_${report.memberId}`)?.value,
            canFillTer: this.tableForm.get(`canFillTer_${report.memberId}`)?.value
          }
        };
      });
      this.service.saveTeamEfficiencyReport(req).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.getTeamEfficiencyReportList();
          }
        }
      });
    }
  }
  // #endregion
}
