import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Button, DataGrid, DataGridColumn, DataGridFieldDataType, DataGridFieldType, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { BaseResponseModel } from '@models/common.model';
import { DateFormats } from '@constants/Enums';
import { TechnicalSkillModalData } from '@models/modal.model';
import { Subject, takeUntil } from 'rxjs';
import { EditTechnicalSkillsComponent } from '../../../../../common/components/modal/edit-technical-skills/edit-technical-skills.component';
import { ManageService } from '../../services/manage.service';
import { ITeamManageList, ITeamManageObject, ITeamManageSearchParams } from '../../models/manage';

const initialSearchParams: ITeamManageSearchParams = {
  ...DEFAULT_PAGINATION,
  search: '',
  sortBy: 'FullName'
};

@Component({
  selector: 'app-team-manage-list',
  templateUrl: './team.manage.list.component.html',
  styleUrl: './team.manage.list.component.css'
})
export class TeamManageListComponent implements OnInit, OnDestroy {
  @ViewChild('technicalSkillTD') technicalSkillTD: TemplateRef<any> | undefined;
  @Input() isEditPermission!: boolean;
  @Input() isExportPermission!: boolean;
  @Output() handleManageTeamSearchParams: EventEmitter<ITeamManageSearchParams> = new EventEmitter<ITeamManageSearchParams>();
  @Output() handleTeamManageTotalRecordsParams: EventEmitter<number | null> = new EventEmitter<number | null>();
  manageTeamSearchParams: ITeamManageSearchParams = { ...initialSearchParams };
  searchName!: TextField;
  designationDropdownConfig!: DropDown;
  designationOptions: DropdownValue[] = [];
  teamLeadDropdownConfig!: DropDown;
  teamLeadDropdownOptions: DropdownValue[] = [];
  technicalSkillDropdownConfig!: DropDown;
  technicalSkillDropdownOptions: DropdownValue[] = [];
  manageTeamGridConfig!: DataGrid<ITeamManageObject>;
  teamManageList: ITeamManageList | null = {} as ITeamManageList;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  filterForm!: FormGroup;
  manageTeamForm!: FormGroup;
  resetSorting: boolean = false;
  isGridLoading: boolean = true;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private service: ManageService,
    private fb: FormBuilder,
    private uiService: UIService,
    private globalService: GlobalService,
  ) {
    this.manageTeamSearchParams = {
      ...this.manageTeamSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.manageTeamSearchParams.pageSize
    };
    this.handleManageTeamSearchParams.emit(this.manageTeamSearchParams);
  }

  ngOnInit() {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setTableConfig();
    this.setButtonConfig();
    this.getDesignations();
    this.getPMTeamLeads();
    this.getTechnicalSkills();
    this.getTeamManageList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  private getDesignations() {
    this.uiService.getDropdownOptions(this.service.getDesignations(), true, { id: "", text: 'Select Designation' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.designationOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private getPMTeamLeads() {
    this.uiService.getDropdownOptions(this.service.getPMTeamLeads(false), true, { id: "", text: 'Select Team Lead' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.teamLeadDropdownOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private getReportingMembers() {
    this.uiService.getDropdownOptions(this.service.getReportingMembers(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.teamManageList?.records.forEach((manage) => {
          manage.reportingMembers = data && data.length > 0 ? data.filter((x) => x.id !== manage.id) : [];
        });
      }
    });
  }

  private getTechnicalSkills() {
    this.uiService.getDropdownOptions(this.service.getTechnicalSkills(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.technicalSkillDropdownOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""],
      designation: [""],
      lead: [""],
      technicalSkill: []
    });

    this.manageTeamForm = this.fb?.group({});
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.designationDropdownConfig = {
      data: {
        data: this.designationOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: true,
      id: 'designation',
      formControlName: 'designation',
      label: 'Designation',
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.teamLeadDropdownConfig = {
      data: {
        data: this.teamLeadDropdownOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: true,
      id: 'teamLead',
      formControlName: 'lead',
      label: 'Team Lead',
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.technicalSkillDropdownConfig = {
      data: {
        data: this.technicalSkillDropdownOptions,
      },
      feature: {
        allowMultiple: true
      },
      isSearchable: true,
      id: 'technicalSkills',
      formControlName: 'technicalSkill',
      label: 'Technical Skills',
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  onReportingMemberChange = (
    data: MatSelectChange
  ): void => {
    const id = data.source.ngControl.name ? data.source.ngControl.name.toString().split('_')[1] : '';
    const reportingToMemberId = data.value;
    this.service.updateReportingToMember(id, reportingToMemberId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<any>) => {
        if (res.isSuccess) {
          this.globalService.openSnackBar(res.message);
          this.getTeamManageList();
        }
      },
    });
  };

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.manageTeamSearchParams = {
      ...initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value,
      designationId: this.filterForm.get('designation')?.value !== "" ? this.filterForm.get('designation')?.value : undefined,
      leadId: this.filterForm.get('lead')?.value !== "" ? this.filterForm.get('lead')?.value : undefined,
      technicalSkillIds: this.filterForm.get('technicalSkill')?.value,
    };
    this.getTeamManageList();
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: "",
      designation: "",
      lead: "",
      technicalSkill: []
    });
    this.manageTeamSearchParams = {
      ...initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getTeamManageList();
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.manageTeamGridConfig = this.getGridConfig();
  }

  private getDisplayColumn(): DataGridColumn<ITeamManageObject>[] {
    let columns: DataGridColumn<ITeamManageObject>[] = [];

    if (this.isEditPermission) {
      columns = [
        {
          field: "fullName",
          title: "Name",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.link,
          isSortable: true,
          showTooltip: true,
          customToolTip: true,
          customToolTipConfig: {
            position: 'right',
            tooltipClass: 'custom-tooltip xlg right-pos table-tooltip'
          },
          customHeaderClassName: "name-column",
        },
        {
          field: "designation",
          title: "Des.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "designation-column",
        },
        {
          field: "currentProjects",
          title: "Current Projects.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "project-column",
        },
        {
          field: "technicalSkills",
          title: "Technical Skills",
          fieldDataType: DataGridFieldDataType.CustomRenderTemplate,
          fieldType: DataGridFieldType.data,
          isSortable: false,
          customRenderTemplate: this.technicalSkillTD,
          customHeaderClassName: "technical-column",
        },
        {
          field: "totalExp",
          title: "Exp.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "experience-column",
        },
        {
          field: "assignedHours",
          title: "Ass. Hrs",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "assignHours-column",
        },
        {
          field: "reportingToMember",
          title: "Reporting To",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "ro-column",
          editConfig: {
            isEditable: true,
            controlType: 'dropdown',
            dataFieldKey: 'reportingMembers',
            idFieldKey: 'id',
            needToShowBasedOn: "FormControl",
            dropdownSelectionChange: this.onReportingMemberChange,
          },
        },
      ];
    }
    else {
      columns = [
        {
          field: "fullName",
          title: "Name",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.link,
          isSortable: true,
          showTooltip: true,
          customToolTip: true,
          customToolTipConfig: {
            position: 'right',
            tooltipClass: 'custom-tooltip xlg right-pos table-tooltip'
          },
          customHeaderClassName: "name-column",
        },
        {
          field: "designation",
          title: "Des.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "designation-column",
        },
        {
          field: "currentProjects",
          title: "Current Projects.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "project-column",
        },
        {
          field: "technicalSkills",
          title: "Technical Skills",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: false,
          customHeaderClassName: "technical-column",
        },
        {
          field: "totalExp",
          title: "Exp.",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "experience-column",
        },
        {
          field: "assignedHours",
          title: "Ass. Hrs",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "assignHours-column",
        },
        {
          field: "reportingToMember",
          title: "Reporting To",
          fieldDataType: DataGridFieldDataType.string,
          fieldType: DataGridFieldType.data,
          isSortable: true,
          customHeaderClassName: "ro-column",
        },
      ];
    }
    return columns;
  }

  private getGridConfig = (): DataGrid<ITeamManageObject> => {
    const config: DataGrid<ITeamManageObject> = {
      columns: this.getDisplayColumn(),
      pageIndex: this.manageTeamSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.manageTeamSearchParams.pageSize,
      totalDataLength: this.teamManageList?.totalRecords || 0,
      isNoRecordFound: !((this.teamManageList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.manageTeamSearchParams = {
          ...this.manageTeamSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getTeamManageList();
      },
      gridData: {
        data: this.teamManageList?.records,
        dataSource: undefined
      },
      id: 'ManageTeamGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'fullName' },
        pageNumber: this.manageTeamSearchParams.pageNumber,
        pageSize: this.manageTeamSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.manageTeamSearchParams = {
            ...this.manageTeamSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };
          this.getTeamManageList();
        }
      }
    };

    if (this.isEditPermission) {
      config.formGroup = this.manageTeamForm;
    }
    return config;
  };

  removeAllControls() {
    // eslint-disable-next-line no-restricted-syntax
    for (const controlName in this.manageTeamForm.controls) {
      if (this.manageTeamForm.controls[`${controlName}`]) {
        this.manageTeamForm.removeControl(controlName);
      }
    }
  }

  private getTeamManageList() {
    this.isGridLoading = true;
    this.handleManageTeamSearchParams.emit(this.manageTeamSearchParams);
    const data = {
      ...this.manageTeamSearchParams
    };
    this.service.getTeamManageList(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITeamManageList>) => {
        if (res.isSuccess && res.data) {
          this.teamManageList = res.data;
          if (this.isEditPermission) {
            this.removeAllControls();
          }

          this.teamManageList.records.forEach((item) => {
            if (this.isEditPermission) {
              this.manageTeamForm.addControl(`reportingToMember_${item.id.toString()}`, new FormControl({ value: item.reportingToMemberId, disabled: false }));
            }
            item.customToolTip = `Email: ${item.email ? item.email : ''}\nContact: ${item.contactNo ? item.contactNo : ''}\nDOB: ${item.birthDate ? this.uiService.convertDateFormat(item.birthDate, DateFormats.DD_MMM_YYYY) : ''}`;
          });

          if (this.teamManageList.records.length > 0 && this.isEditPermission) {
            this.getReportingMembers();
          }
          this.handleTeamManageTotalRecordsParams.next(this.teamManageList.records.length);
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

  openTechnicalSkillDialog(rowData: ITeamManageObject) {
    const dialogRef = this.dialog.open(EditTechnicalSkillsComponent, {
      width: '450px',
      autoFocus: false,
      data: {
        title: 'Edit Technical Skills For PER',
        id: rowData.id,
        fullName: rowData.fullName,
        technicalSkillIds: rowData.technicalSkillIds
      } as TechnicalSkillModalData
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTeamManageList();
      }
    });
  }
}
