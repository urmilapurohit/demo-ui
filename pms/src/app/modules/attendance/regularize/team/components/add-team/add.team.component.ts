import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DataGrid, DataGridFieldDataType, DateField, DropDown, DropdownValue, GlobalService, TextArea } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { AttendanceRegularizeStatus, AttendanceType } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ITeamDetails, ITeamHistoryObject, ITeamObject, ITeamUpdate } from '../../models/team.model';
import { TeamService } from '../../services/team.service';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-add.team',
  templateUrl: './add.team.component.html',
  styleUrl: './add.team.component.css'
})
export class AddTeamComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addTeamFormGroup!: FormGroup;
  attendanceDate!: DateField;
  status!: DropDown;
  isGridLoading: boolean = true;
  submittedAttendance!: DropDown;
  correctedAttendance!: DropDown;
  approverComments!: TextArea;
  submitButtonConfig!: Button;
  cancelButtonConfig!: Button;
  teamHistoryGridConfig!: DataGrid<ITeamHistoryObject>;
  teamHistoryList: ITeamHistoryObject[] | null = [] as ITeamHistoryObject[];
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = true;
  resetSorting: boolean = false;
  teamId: string = '';
  isViewOnly: boolean = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  statusList!: DropdownValue[];
  today = new Date();
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: '', isSortable: false },
    { field: "statusChangedDate", title: "Status Changed Date", customHeaderClassName: '', fieldDataType: DataGridFieldDataType.date, isSortable: false },
    { field: "status", title: "status", customHeaderClassName: '', isSortable: false },
    { field: "comments", title: "Comments", customHeaderClassName: '', isSortable: false },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private regularizeService: RegularizeService
  ) {
    this.teamId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  // #endregion

  get f() {
    return this.addTeamFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.setTableConfig();
      this.getRequestStatusHistoryList(Number(this.teamId));
      this.getTeamById(Number(this.teamId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }
  // #region methods

  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Team' : 'Add Team';
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Regularize', link: '' },
      { label: 'Team', link: ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_ABSOLUTE },
      { label: LABEL, link: '' }
    ];
  }

  backToTeamGrid(): void {
    this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_ABSOLUTE]);
  }

  private getTeamById(id: number) {
    this.service.getTeamById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITeamDetails>) => {
        if (res.isSuccess && res.data) {
          this.addTeamFormGroup.patchValue({
            attendanceDate: res.data.attendanceDate || "",
            submittedAttendanceType: res.data.submittedAttendanceType || "",
            correctedAttendanceType: res.data.correctedAttendanceType || "",
            status: res.data?.attendanceRegularizationStatusId === AttendanceRegularizeStatus.PENDING ? '' : res.data?.attendanceRegularizationStatusId,
            comments: res.data.comments || ""
          });
          if (res.data.attendanceRegularizationStatusId !== AttendanceRegularizeStatus.PENDING && res.data.attendanceRegularizationStatusId !== AttendanceRegularizeStatus.APPROVED && res.data.attendanceRegularizationStatusId !== AttendanceRegularizeStatus.REJECTED) {
            this.isViewOnly = true;
            this.addTeamFormGroup.get('status')?.disable();
            this.addTeamFormGroup.get('comments')?.disable();
          }
          else {
            this.isViewOnly = false;
          }
          this.getStatusList();
        }
      }
    });
  }

  private getRequestStatusHistoryList(id: number) {
    this.isGridLoading = true;

    this.service.getHistories(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITeamHistoryObject[]>) => {
        if (res.isSuccess && res.data) {
          this.teamHistoryList = res.data;
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

  private getStatusList(): void {
    if (this.isViewOnly) {
      this.uiService.getDropdownOptions(this.service.getTeamStatus(), true, { id: "", text: 'Select Status' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (data: DropdownValue[]) => {
          this.statusList = data;
          this.setTextBoxConfig();
        },
      });
    }
    else {
      this.uiService.getDropdownOptions(this.service.getSelfStatus(), true, { id: "", text: 'Select Status' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (data: DropdownValue[]) => {
          this.statusList = data;
          this.setTextBoxConfig();
        },
      });
    }
  }

  private initializeForm(): void {
    this.addTeamFormGroup = this.fb?.group({
      attendanceDate: [{ value: this.today, disabled: this.isEdit }, [Validators.required]],
      submittedAttendanceType: [{ value: AttendanceType.PRESENT, disabled: this.isEdit }, [Validators.required]],
      correctedAttendanceType: [{ value: AttendanceType.PRESENT, disabled: this.isEdit }, [Validators.required]],
      status: [{ value: "", }, [Validators.required]],
      comments: [{ value: "", }, [Validators.required]],
    });
  }

  private setButtonConfig(): void {
    this.submitButtonConfig = this.regularizeService.getSubmitButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.attendanceDate = {
      label: 'Attendance Date',
      formControlName: 'attendanceDate',
      onChangeDate: () => { },
      onEnterPress: () => { this.OnSave(); },
      needOnKeyDown: false,
      isRequired: true,
    };

    this.submittedAttendance = {
      data: {
        data: ATTENDANCE_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'submittedAttendance',
      formControlName: 'submittedAttendanceType',
      label: 'Submitted Attendance',
      isRequired: true,
      isSearchable: true,
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.OnSave(); }
    };

    this.correctedAttendance = {
      data: {
        data: ATTENDANCE_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'correctedAttendance',
      formControlName: 'correctedAttendanceType',
      label: 'Correction To Be Done',
      isRequired: true,
      isSearchable: true,
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.OnSave(); }
    };

    this.status = {
      data: {
        data: this.statusList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      isRequired: true,
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.OnSave(); }
    };

    this.approverComments = {
      label: 'Comments',
      formControlName: 'comments',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control',
      isRequired: true,
    };
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.addTeamFormGroup.valid) {
      const data: ITeamUpdate = {
        status: this.f['status'].value,
        comments: this.f['comments'].value
      };
      this.loading = true;

      if (this.isEdit) {
        this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_ABSOLUTE]);
        this.service.updateTeam(Number(this.teamId), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (res: BaseResponseModel<ITeamObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM_ABSOLUTE]);
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.teamHistoryGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<ITeamHistoryObject> => {
    const config: DataGrid<ITeamHistoryObject> = {
      columns: this.setTableColumns(),
      pageIndex: 1,
      defaultPageSize: this.uiService.getPageSize(),
      totalDataLength: this.teamHistoryList?.length || 0,
      isNoRecordFound: !((this.teamHistoryList?.length ?? 0) > 0),
      gridData: {
        data: this.teamHistoryList ?? [],
        dataSource: undefined
      },
      id: 'SelfGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  // #endregion
}
