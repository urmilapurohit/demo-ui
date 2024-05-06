import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DataGrid, DataGridFieldDataType, DateField, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { AttendanceRegularizeStatus, DateFormats } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { SelfService } from '../../services/self.service';
import { IAddSelf, IGetAttendanceByDate, ISelfHistoryObject, ISelfObject } from '../../models/self';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-add-self',
  templateUrl: './add.self.component.html',
  styleUrl: './add.self.component.css'
})
export class AddSelfComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addSelfFormGroup!: FormGroup;
  attendanceDate!: DateField;
  submittedAttendance!: DropDown;
  correctedAttendance!: DropDown;
  submitButtonConfig!: Button;
  requestStatusHistoryGridConfig!: DataGrid<ISelfHistoryObject>;
  requestStatusHistoryList: ISelfHistoryObject[] | null = [];
  isGridLoading: boolean = true;
  resetSorting: boolean = false;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  selfId: string = '';
  isViewOnly: boolean = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  attendanceOptionForCorrectedAttendance: DropdownValue[] = ATTENDANCE_OPTIONS;
  today = new Date();
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column", isSortable: false },
    { field: "statusChangedDate", title: "Status Changed Date", customHeaderClassName: "status-changed-column", fieldDataType: DataGridFieldDataType.dateTime, isSortable: false },
    { field: "status", title: "Status", customHeaderClassName: "status-column", isSortable: false },
    { field: "comments", title: "Comments", customHeaderClassName: "comments-column", isSortable: false }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: SelfService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private regularizeService: RegularizeService
  ) {
    this.selfId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.selfId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addSelfFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.setTableConfig();
      this.getRequestStatusHistoryList(Number(this.selfId));
      this.getSelfById(Number(this.selfId));
    } else {
      this.getPendingAttendance();
    }
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.setDatePickerConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Self' : 'Add Self';
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Regularize', link: '' },
      { label: 'Self', link: ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  backToSelfGrid(): void {
    this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_ABSOLUTE]);
  }

  getSelfById(id: number) {
    this.service.getSelfById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISelfObject>) => {
        if (res.isSuccess && res.data) {
          this.addSelfFormGroup.patchValue({
            attendanceDate: res.data?.attendanceDate || "",
            submittedAttendanceType: res.data?.submittedAttendanceType,
            correctedAttendanceType: res.data?.correctedAttendanceType
          });
          this.attendanceOptionForCorrectedAttendance = ATTENDANCE_OPTIONS.filter((x) => x.id !== res.data.submittedAttendanceType);
          this.setDropDownConfig();
          if (res.data.attendanceRegularizationStatusId === AttendanceRegularizeStatus.CANCELED || res.data.attendanceRegularizationStatusId === AttendanceRegularizeStatus.CORRECTED) {
            this.isViewOnly = true;
            this.addSelfFormGroup.get('correctedAttendanceType')?.disable();
          }
          else {
            this.isViewOnly = false;
          }
        }
      }
    });
  }
  getRequestStatusHistoryList(id: number) {
    this.isGridLoading = true;

    this.service.getHistories(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISelfHistoryObject[]>) => {
        if (res.isSuccess && res.data) {
          this.requestStatusHistoryList = res.data;
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

  private initializeForm(): void {
    this.addSelfFormGroup = this.fb?.group({
      attendanceDate: [{ value: this.today, disabled: this.isEdit }, [Validators.required]],
      submittedAttendanceType: [{ value: "", disabled: true }, [Validators.required]],
      correctedAttendanceType: ["", [Validators.required]],
    });
  }

  private setButtonConfig(): void {
    this.submitButtonConfig = this.regularizeService.getSubmitButtonConfig(() => { this.OnSave(); }, () => { return (this.addSelfFormGroup.controls['submittedAttendanceType']?.value === ""); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_ABSOLUTE]); });
  }

  private setDatePickerConfig = (): void => {
    this.attendanceDate = {
      label: 'Attendance Date',
      formControlName: 'attendanceDate',
      needOnKeyDown: true,
      isYearPicker: false,
      onChangeDate: () => { this.getPendingAttendance(); },
      onEnterPress: () => { this.getPendingAttendance(); },
      isRequired: true,
      max: () => this.today,
    };
  };

  private getPendingAttendance(): void {
    this.isGridLoading = true;
    const data: IGetAttendanceByDate = {
      attendanceDate: this.uiService.convertDateFormat(this.addSelfFormGroup.controls['attendanceDate']?.value, DateFormats.YYYY_MM_DD),
    };
    this.service.getAttendanceByDate(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<string>) => {
        if (res.isSuccess && res.data) {
          this.addSelfFormGroup.patchValue({
            submittedAttendanceType: res.data
          });
          this.attendanceOptionForCorrectedAttendance = ATTENDANCE_OPTIONS.filter((x) => x.id !== res.data);
          this.setButtonConfig();
          this.setDropDownConfig();
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

  private setTableConfig(): void {
    this.resetSorting = false;
    this.requestStatusHistoryGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setDropDownConfig(): void {
    this.submittedAttendance = {
      data: {
        data: ATTENDANCE_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'submitted',
      formControlName: 'submittedAttendanceType',
      label: 'Submitted Attendance',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };
    this.correctedAttendance = {
      data: {
        data: this.attendanceOptionForCorrectedAttendance,
      },
      feature: {
        allowMultiple: false
      },
      id: 'corrected',
      formControlName: 'correctedAttendanceType',
      label: 'Correction To Be Done',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addSelfFormGroup.valid) {
      const data: IAddSelf = {
        attendanceDate: this.uiService.convertDateFormat(this.f?.['attendanceDate']?.value, DateFormats.YYYY_MM_DD),
        submittedAttendanceType: this.f?.['submittedAttendanceType']?.value,
        correctedAttendanceType: this.f?.['correctedAttendanceType']?.value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateSelf(Number(this.selfId), data) : this.service.addSelf(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ISelfObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  private getGridConfig = (): DataGrid<ISelfHistoryObject> => {
    const config: DataGrid<ISelfHistoryObject> = {
      columns: this.setTableColumns(),
      pageIndex: 1,
      defaultPageSize: this.uiService.getPageSize(),
      totalDataLength: this.requestStatusHistoryList?.length || 0,
      isNoRecordFound: !((this.requestStatusHistoryList?.length ?? 0) > 0),
      gridData: {
        data: this.requestStatusHistoryList ?? [],
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
