import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, ButtonType, ButtonVariant, DropDown, GLOBAL_CONSTANTS, GlobalService } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { DateFormats, Pages } from '@constants/Enums';
import { PermissionService } from '@services/permission.service';
import { Subject, takeUntil } from 'rxjs';
import { IAttendanceData, IAttendanceObject, IAttendanceSearchParams, IGetAttendanceModel, ISaveAttendanceModel } from '../../models/self.attendance.model';
import { SelfAttendanceService } from '../../services/self.attendance.service';
import { AttendanceTypeLabels } from '../../../attendance.config';

@Component({
  selector: 'app-self-attendance',
  templateUrl: './self.attendance.component.html',
  styleUrl: './self.attendance.component.css'
})
export class SelfAttendanceComponent implements OnInit, OnDestroy {
  // #region class member
  yearDropDown!: DropDown;
  monthDropDown!: DropDown;
  filterForm !: FormGroup;
  searchBtnConfig!: Button;
  resetBtnConfig !: Button;
  fillAttendanceBtnConfig !: Button;
  attendanceData !: IAttendanceData;
  attendanceSearchParams: IAttendanceSearchParams = { month: null, year: null };
  isLoading = false;
  presentDay: number = 0;
  absentDay: number = 0;
  totalDays: number = 0;
  breadcrumbItems: BreadcrumbItem[] = [];
  displayedColumns: string[] = [];
  monthYearLabel: string = "";
  attendanceForm!: FormGroup;
  attendanceOptions = ATTENDANCE_OPTIONS;
  AttendanceTypeLabels = AttendanceTypeLabels;
  editableDay!: IAttendanceObject | undefined;
  joinDate: string = "";
  pagePermissions: PageAccessPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(private uiService: UIService, private fb: FormBuilder, private service: SelfAttendanceService, private globalService: GlobalService, private permissionService: PermissionService) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AttendanceSelf);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.setButtonConfig();
    this.getSelfAttendance();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      year: [new Date().getFullYear()],
      month: [new Date().getMonth() + 1]
    });
    this.attendanceForm = this.fb?.group({
      attendance: [""]
    });
    this.attendanceSearchParams = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    };
  }

  setDisplayColumns = (data: IAttendanceObject[]) => {
    const record = data.filter((x) => x.isEditable);
    if (record && record[0]?.attendanceType) {
      this.attendanceForm.get("attendance")?.patchValue(record[0].attendanceType);
    }
    const newData: IAttendanceObject[] = JSON.parse(JSON.stringify(data));
    this.editableDay = newData.find((x) => x.attendanceDate === moment(new Date()).format(DateFormats.YYYY_MM_DD));
    this.displayedColumns = newData.map((x) => `${x.attendanceDate}_${x.nameOfDay}`);
    let filteredData = newData.filter((x) => !x.isPublicHoliday && !x.isWeekOff);
    if (this.joinDate && filteredData) {
      filteredData = filteredData.filter((x) => moment(x.attendanceDate).isSameOrAfter(this.joinDate));
    }
    this.totalDays = filteredData?.length;
  };

  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Self', link: '' }
    ];
  }

  getDateFormat = (date: string): string => {
    return moment(date).format(GLOBAL_CONSTANTS.DATE_FORMATE.DD_MMM_YYYY);
  };

  onAttendanceSelect = (menuData: { date: string }, attendanceType: string) => {
    const data = { ...this.attendanceData };
    data.attendance.forEach((x) => {
      if (x.attendanceDate === menuData.date) {
        x.attendanceType = attendanceType;
        this.attendanceForm.get("attendance")?.patchValue(attendanceType);
      }
    });
    this.attendanceData = { ...data };
  };

  isDisabled = (date: string) => {
    if (this.joinDate && moment(date) < moment(this.joinDate)) {
      return true;
    }
    return false;
  };

  getMonthYearLabel = (value: string) => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      this.monthYearLabel = monthYear.replace(' ', '-');
    }
  };

  setDropDownConfig(): void {
    this.yearDropDown = {
      data: {
        data: this.uiService.getFourYearsFromNow(),
      },
      feature: {
        allowMultiple: false
      },
      id: 'yearDropdown',
      formControlName: 'year',
      label: 'Year',
      customFormFieldClass: 'custom-form-group small-width-field',
      onEnterPress: () => { this.getSelfAttendance(); },
    };

    this.monthDropDown = {
      data: {
        data: this.uiService.getMonths(),
      },
      feature: {
        allowMultiple: false
      },
      id: 'monthDropdown',
      formControlName: 'month',
      label: 'Month',
      customFormFieldClass: 'custom-form-group small-width-field',
      onEnterPress: () => { this.getSelfAttendance(); },
    };
  }

  private applyFilter(): void {
    this.attendanceSearchParams = {
      month: this.filterForm.get('month')?.value,
      year: this.filterForm.get('year')?.value
    };
    this.getSelfAttendance();
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    this.fillAttendanceBtnConfig = {
      id: 'fillAttendanceBtn',
      buttonText: 'Fill Attendance',
      buttonType: ButtonType.default,
      className: 'primary-btn',
      buttonVariant: ButtonVariant.iconWithText,
      imgUrl: './assets/images/checkmark-white.svg',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.saveSelfAttendance(); },
    };
  }

  private resetFilter(): void {
    this.filterForm.patchValue({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    });
    this.attendanceSearchParams = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    };
    this.getSelfAttendance();
  }

  private getSelfAttendance = () => {
    this.isLoading = true;
    const data: IGetAttendanceModel = {
      month: this.attendanceSearchParams.month || 0,
      year: this.attendanceSearchParams.year || 0
    };

    this.service.GetAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IAttendanceData>) => {
        if (res.isSuccess && res.data) {
          this.attendanceData = res.data;
          this.presentDay = res.data?.presentDay;
          this.absentDay = res.data?.absentDay;
          this.joinDate = res.data?.joiningDate;
          this.getMonthYearLabel(res.data?.attendance[0]?.attendanceDate);
          this.setDisplayColumns(res.data.attendance);
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  };

  private saveSelfAttendance = () => {
    const attendanceType = this.attendanceForm.get('attendance')?.value;
    if (attendanceType && this.editableDay && this.editableDay?.attendanceType !== attendanceType) {
      const requestObject: ISaveAttendanceModel = {
        attendanceType
      };

      this.service.SaveSelfAttendance(requestObject).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IAttendanceData>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res?.message);
            this.getSelfAttendance();
          }
        }
      });
    }
    else {
      this.globalService.openSnackBar("There are no unsaved changes for today.", "warning-message");
    }
  };
  // #endregion
}
