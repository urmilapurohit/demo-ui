import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DataGrid, DataGridFieldDataType, DateField, DropDown, DropdownValue, GlobalService, TextArea } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ATTENDANCE_OPTIONS, } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { AttendanceRegularizeStatus, AttendanceType } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { ManageService } from '../../services/manage.service';
import { IManageUpdate, IManageHistoryObject, IManageObject, IManageDetails } from '../../models/manage';
import { RegularizeService } from '../../../services/regularize.services';

@Component({
  selector: 'app-add-manage',
  templateUrl: './add.manage.component.html',
  styleUrl: './add.manage.component.css'
})
export class AddManageComponent implements OnInit, OnDestroy {
  // #region class members
  addManageFormGroup!: FormGroup;
  attendanceDate!: DateField;
  submittedAttendance!: DropDown;
  correctedAttendance!: DropDown;
  status!: DropDown;
  comments!: TextArea;
  submitButtonConfig!: Button;
  requestStatusHistoryGridConfig!: DataGrid<IManageHistoryObject>;
  requestStatusHistoryList: IManageHistoryObject[] | null = [] as IManageHistoryObject[];
  isGridLoading: boolean = true;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  manageId: string = '';
  isViewOnly: boolean = true;
  breadcrumbItems: BreadcrumbItem[] = [];
  statusList!: DropdownValue[];
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
    private service: ManageService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private regularizeService: RegularizeService
  ) {
    this.manageId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  get f() {
    return this.addManageFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getManageById(Number(this.manageId));
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.setDatePickerConfig();
    this.setTableConfig();
    this.getRequestStatusHistoryList(Number(this.manageId));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = 'Edit Manage';
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Regularize', link: '' },
      { label: 'Manage', link: ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  backToManageGrid(): void {
    this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_ABSOLUTE]);
  }

  private getRequestStatusHistoryList(id: number) {
    this.isGridLoading = true;

    this.service.getHistories(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IManageHistoryObject[]>) => {
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

  private getStatusList(): void {
    if (this.isViewOnly) {
      this.uiService.getDropdownOptions(this.service.getManageStatus(), true, { id: '', text: 'Select Status' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (data: DropdownValue[]) => {
          this.statusList = data;
          this.setDropDownConfig();
        },
      });
    }
    else {
      this.uiService.getDropdownOptions(this.service.getSelfStatus(), true, { id: '', text: 'Select Status' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (data: DropdownValue[]) => {
          this.statusList = data;
          this.setDropDownConfig();
        },
      });
    }
  }

  private initializeForm(): void {
    this.addManageFormGroup = this.fb?.group({
      attendanceDate: [{ value: this.today, disabled: true }, [Validators.required]],
      submittedAttendanceType: [{ value: AttendanceType.PRESENT, disabled: true }, [Validators.required]],
      correctedAttendanceType: [{ value: AttendanceType.PRESENT, disabled: true }, [Validators.required]],
      status: [{ value: "" }, [Validators.required]],
      comments: ["", [Validators.required]],
    });
  }

  private setButtonConfig(): void {
    this.submitButtonConfig = this.regularizeService.getSubmitButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_ABSOLUTE]); });
  }

  private getManageById(id: number) {
    this.service.getManageById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IManageDetails>) => {
        if (res.isSuccess && res.data) {
          this.addManageFormGroup.setValue({
            attendanceDate: res.data?.attendanceDate || "",
            submittedAttendanceType: res.data?.submittedAttendanceType,
            correctedAttendanceType: res.data?.correctedAttendanceType,
            status: res.data?.attendanceRegularizationStatusId === AttendanceRegularizeStatus.APPROVED ? "" : res.data?.attendanceRegularizationStatusId,
            comments: res.data?.comments
          });
          if (res.data.attendanceRegularizationStatusId === AttendanceRegularizeStatus.APPROVED) {
            this.isViewOnly = false;
          }
          else {
            this.addManageFormGroup.get('status')?.disable();
            this.addManageFormGroup.get('comments')?.disable();
          }
          this.getStatusList();
        }
      },
    });
  }

  private setDatePickerConfig = (): void => {
    this.attendanceDate = {
      label: 'Attendance Date',
      formControlName: 'attendanceDate',
      needOnKeyDown: true,
      isYearPicker: false
    };
  };

  private setTableConfig(): void {
    this.requestStatusHistoryGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<IManageHistoryObject> => {
    const config: DataGrid<IManageHistoryObject> = {
      columns: this.setTableColumns(),
      pageIndex: 1,
      defaultPageSize: this.uiService.getPageSize(),
      totalDataLength: this.requestStatusHistoryList?.length || 0,
      isNoRecordFound: !((this.requestStatusHistoryList?.length ?? 0) > 0),
      gridData: {
        data: this.requestStatusHistoryList ?? [],
        dataSource: undefined
      },
      id: 'ManageGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private setDropDownConfig(): void {
    this.status = {
      data: {
        data: this.statusList
      },
      feature: {
        allowMultiple: false
      },
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); },
    };
    this.comments = {
      label: 'Comments',
      formControlName: 'comments',
      rows: 5,
      placeholder: '',
      isRequired: true,
      customClass: 'custom-form-control'
    };
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
    };

    this.correctedAttendance = {
      data: {
        data: ATTENDANCE_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'corrected',
      formControlName: 'correctedAttendanceType',
      label: 'Correction To Be Done',
      customFormFieldClass: 'custom-form-group',
      onEnterPress: () => { this.OnSave(); },
    };
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addManageFormGroup.valid) {
      const data: IManageUpdate = {
        status: this.f?.['status']?.value,
        comments: this.f?.['comments']?.value
      };
      this.loading = true;

      this.service.updateManage(Number(this.manageId), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IManageObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
  // #endregion
}
