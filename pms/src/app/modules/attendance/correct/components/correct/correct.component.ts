import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoComplete, BaseResponseModel, Button, DateField, DropDown, DropdownValue, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { DateFormats, Pages } from '@constants/Enums';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from '@services/permission.service';
import { ICorrect } from '../../models/correct';
import { CorrectService } from '../../services/correct.service';

@Component({
  selector: 'app-correction',
  templateUrl: './correct.component.html',
  styleUrl: './correct.component.css'
})
export class CorrectComponent implements OnInit, OnDestroy {
  // #region class members
  correctionFormGroup!: FormGroup;
  member!: AutoComplete;
  date!: DateField;
  attendance!: TextField;
  correctedAttendance!: DropDown;
  saveButtonConfig!: Button;
  resetBtnConfig!: Button;
  submitted: boolean = false;
  memberList: DropdownValue[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: CorrectService,
    private fb: FormBuilder,
    public globalService: GlobalService,
    public router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AttendanceCorrect);
  }
  // #endregion

  get f() {
    return this.correctionFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getMemberList();
    this.setBreadcrumb();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.setAutoCompleteConfig();

    this.correctionFormGroup.get('member')!.valueChanges.subscribe((value) => {
      const date = this.uiService.convertDateFormat(this.f?.['attendanceDate']?.value, DateFormats.YYYY_MM_DD);
      const memberId = this.getMemberId(value);
      if (date) {
        this.checkMemberAttendance(memberId, date);
      }
    });

    this.correctionFormGroup.get('attendanceDate')!.valueChanges.subscribe((value) => {
      const member = this.f?.['member']?.value;
      const memberId = this.getMemberId(member);
      const date = this.uiService.convertDateFormat(value, DateFormats.YYYY_MM_DD);
      if (member) {
        this.checkMemberAttendance(memberId, date);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods

  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Correct', link: '' }
    ];
  }

  private checkMemberAttendance(memberId: number, date: string): void {
    const data: ICorrect = {
      memberId,
      attendanceDate: date
    };
    if (memberId > 0 && this.correctionFormGroup.get('attendanceDate')?.valid) {
      this.service.checkAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<string>) => {
          this.correctionFormGroup?.get('attendance')?.patchValue(res.data);
        }
      });
    }
    else {
      this.correctionFormGroup?.get('attendance')?.patchValue("");
    }
  }

  private getMemberId(value: string) {
    return Number(this.memberList.find((x) => x.text === value)?.id);
  }

  private initializeForm(): void {
    this.correctionFormGroup = this.fb?.group({
      member: ["", [Validators.required]],
      attendanceDate: ["", [Validators.required]],
      correctedAttendance: ["", [Validators.required]],
      attendance: [{ value: "", disabled: true }]
    });
  }

  private getMemberList() {
    this.uiService.getDropdownOptions(this.service.getMembers({ search: "  " }), true).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.memberList = data;
        this.setAutoCompleteConfig();
      }
    });
  }

  private setAutoCompleteConfig = (): void => {
    this.member = {
      label: 'Member',
      formControlName: 'member',
      options: this.memberList.map((x) => x.text),
      placeholder: "",
      customFormFieldClass: 'custom-form-group sm-form-group',
      isRequired: true
    };
  };

  private setTextBoxConfig = (): void => {
    this.attendance = {
      label: 'Submitted Attendance',
      formControlName: 'attendance',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: false
    };

    this.date = {
      label: 'Attendance Date',
      formControlName: 'attendanceDate',
      onChangeDate: () => { },
      onEnterPress: () => { this.OnSave(); },
      needOnKeyDown: true,
      isRequired: true,
      max: () => { return new Date(); }
    };

    this.correctedAttendance = {
      data: {
        data: ATTENDANCE_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'correctedAttendance',
      formControlName: 'correctedAttendance',
      label: 'Corrected Attendance',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };
  };

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetValues(); });
  }

  private resetValues(): void {
    this.submitted = false;
    this.correctionFormGroup.setValue({
      member: "",
      attendanceDate: "",
      correctedAttendance: "",
      attendance: ""
    });
  }

  public OnSave(): void {
    this.submitted = true;
    if (this.correctionFormGroup.valid) {
      const member = this.f?.['member']?.value;
      const memberId = this.getMemberId(member);
      const data: ICorrect = {
        memberId,
        attendanceDate: this.uiService.convertDateFormat(this.f?.['attendanceDate']?.value, DateFormats.YYYY_MM_DD),
        attendanceType: this.f?.['correctedAttendance']?.value,
      };
      if (ATTENDANCE_OPTIONS.find((x) => x.id === data.attendanceType)?.text === this.f?.['attendance']?.value) {
        this.globalService.openSnackBar("There are no unsaved changes for today.", "warning-message");
      }
      else {
        this.confirmationDialog(data);
      }
    }
  }

  private saveConfirmation(data: ICorrect): void {
    this.service.correctAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ICorrect>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response.message);
          this.resetValues();
        }
      }
    });
  }

  private confirmationDialog(data: ICorrect): void {
    this.uiService.openConfirmationModal(
      "Are you sure want to correct the attendance?",
      () => {
        this.saveConfirmation(data);
      }
    );
  }
  // #endregion
}
