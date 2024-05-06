/* eslint-disable no-restricted-syntax */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AutoComplete, DropDown, Checkbox, Button, DropdownValue, GlobalService, ButtonType, ButtonVariant, BaseResponseModel } from 'workspace-library';
import { Router } from '@angular/router';
import moment from 'moment';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { IAttendanceData, IAttendanceResponse, IGetAttendanceModel, IParentHistory, IReportingMember, ISaveAttendanceModel } from '../../models/manage.attendance.model';
import { ManageAttendanceService } from '../../services/manage.attendance.service';
import { AttendanceTypeLabels } from '../../../attendance.config';

@Component({
  selector: 'app-manage-attendance',
  templateUrl: './manage.attendance.component.html',
  styleUrl: './manage.attendance.component.css'
})
export class ManageAttendanceComponent implements OnInit, OnDestroy {
  // #region class member
  reportingOfficer!: AutoComplete;
  yearDropDown!: DropDown;
  monthDropDown!: DropDown;
  includeAllTeam!: Checkbox;
  todaysPendingAttendance!: Checkbox;
  filterForm !: FormGroup;
  searchBtnConfig!: Button;
  resetBtnConfig !: Button;
  fillAttendanceBtnConfig!: Button;
  monthYearLabel = "";
  breadcrumbItems: BreadcrumbItem[] = [];
  isLoading = false;
  displayedColumns: string[] = [];
  attendanceData: IAttendanceData[] = [];
  attendanceDataDuplicate: IAttendanceData[] = [];
  attendanceOptions = ATTENDANCE_OPTIONS;
  reportOfficeList: DropdownValue[] = [];
  AttendanceTypeLabels = AttendanceTypeLabels;
  historyArray: IParentHistory[] = [];
  editableColumns: string[] = [];
  attendanceForm!: FormGroup;
  pagePermissions: PageAccessPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(private uiService: UIService, private fb: FormBuilder, private service: ManageAttendanceService, private globalService: GlobalService, private router: Router, private permissionService: PermissionService) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AttendanceManage);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setBreadcrumb();
    this.setDropDownConfig();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setCheckBoxConfig();
    this.getReportingOfficer(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setTextBoxConfig(): void {
    this.reportingOfficer = {
      label: 'RO',
      formControlName: 'memberName',
      options: this.reportOfficeList.map((x) => x.text),
      placeholder: "",
      onSelect: (selectedValue) => {
        const memberId = this.reportOfficeList.find((x) => x.text === selectedValue)?.id;
        this.filterForm.patchValue({
          memberId,
          memberName: selectedValue
        });
      },
      customFormFieldClass: 'custom-form-group sm-form-group',
    };
  }

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
      onEnterPress: () => { },
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
      onEnterPress: () => { },
    };
  }

  setCheckBoxConfig(): void {
    this.includeAllTeam = this.uiService.getCheckBoxConfig('Include All Team Members', 'includeAllTeamMembers');
    this.todaysPendingAttendance = this.uiService.getCheckBoxConfig("Today's Pending Attendance", 'todaysPendingAttendance');
  }

  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Manage', link: '' }
    ];
  }

  getMonthYearLabel = (value: string) => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      this.monthYearLabel = monthYear.replace(' ', '-');
    }
  };

  setDisplayColumns = (data: IAttendanceData[]) => {
    const editableColumns = data[0]?.teamMembers[0]?.attendance?.filter((x) => x.isEditable).map((y) => `${y.attendanceDate}`);
    const attendanceData = data[0]?.teamMembers[0]?.attendance?.map((x) => `${x.attendanceDate}_${x.nameOfDay}`);
    attendanceData?.unshift("name");
    this.displayedColumns = attendanceData;
    this.editableColumns = editableColumns;
    editableColumns?.forEach((x) => {
      // today's control should be selected by default
      const isSameDay = moment(x).isSame(new Date(), 'day');
      this.attendanceForm.addControl(
        x,
        new FormControl({ value: isSameDay, disabled: false })
      );
    });
  };

  onParentNameClick = (memberId: number): void => {
    const filteredData = this.reportOfficeList.find((x) => x.id === Number(memberId));
    if (filteredData && filteredData.id && filteredData.text) {
      this.filterForm.patchValue({
        memberName: filteredData?.text,
        memberId: filteredData?.id,
      });

      this.getAttendance();
    }
  };

  onMissingAttendanceClick() {
    this.router.navigate([ROUTES.ATTENDANCE.MANAGE.MANAGE_MISSING_ATTENDANCE_ABSOLUTE]);
  }

  onAttendanceSelect = ([memberId, attendanceType, date]: [number, string, string]) => {
    const updatedAttendanceData = this.attendanceData.map((team) => ({
      ...team,
      teamMembers: team.teamMembers.map((member) => ({
        ...member,
        attendance: member.attendance.map((attendance) => {
          if (member.memberId === memberId && attendance.attendanceDate === date) {
            return { ...attendance, attendanceType };
          }
          return attendance;
        })
      }))
    }));
    this.attendanceData = updatedAttendanceData;
  };

  getSaveAttendanceData = () => {
    const data: ISaveAttendanceModel[] = [];
    this.attendanceData.forEach((x, i1: number) => {
      x.teamMembers.forEach((y, i2: number) => {
        y.attendance.forEach((z, i3: number) => {
          if (z.isEditable === true) {
            if (z.attendanceType && this.isColumnChecked(z.attendanceDate) && (!z.isSubmitted || (z.isSubmitted && z.attendanceType !== this.attendanceDataDuplicate[i1].teamMembers[i2].attendance[i3].attendanceType))) {
              data.push({
                attendanceType: z.attendanceType,
                memberId: y.memberId,
                attendanceDate: z.attendanceDate
              });
            }
          }
        });
      });
    });
    return data;
  };

  isColumnChecked = (formControlName: string) => {
    const attendanceFormControl = this.attendanceForm.get(formControlName);
    if (attendanceFormControl && attendanceFormControl.value) {
      return true;
    }
    return false;
  };

  setReportingOfficerHierarchy = (data: IReportingMember[]) => {
    this.historyArray = data.map((x, index: number) => {
      return {
        memberId: x.memberId,
        name: x.name,
        order: index + 1
      };
    });
  };

  checkAllControls = () => {
    for (const controlName in this.attendanceForm.controls) {
      if (this.attendanceForm.controls[`${controlName}`]) {
        if (this.attendanceForm.controls[`${controlName}`].value) {
          return true;
        }
      }
    }
    return false;
  };

  removeControls = () => {
    for (const controlName in this.attendanceForm.controls) {
      if (this.attendanceForm.controls[`${controlName}`]) {
        this.attendanceForm.removeControl(controlName);
      }
    }
  };

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      memberId: [""],
      memberName: [""],
      year: [new Date().getFullYear()],
      month: [new Date().getMonth() + 1],
      includeAllTeamMembers: [false],
      todaysPendingAttendance: [false]
    });

    this.attendanceForm = this.fb?.group({});

    this.filterForm.get('month')?.valueChanges.subscribe((month: number) => {
      const formControl = this.filterForm.get('todaysPendingAttendance');
      if (month !== new Date().getMonth() + 1) {
        formControl?.patchValue(false);
        formControl?.disable();
      }
      else {
        formControl?.enable();
      }
    });

    this.filterForm.get('year')?.valueChanges.subscribe((year: number) => {
      const formControl = this.filterForm.get('todaysPendingAttendance');
      if (year !== new Date().getFullYear()) {
        formControl?.patchValue(false);
        formControl?.disable();
      }
      else {
        formControl?.enable();
      }
    });
  }

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    this.fillAttendanceBtnConfig = {
      id: 'submitAttendanceBtn',
      buttonText: 'Submit Attendance',
      buttonType: ButtonType.default,
      className: 'primary-btn',
      buttonVariant: ButtonVariant.iconWithText,
      imgUrl: './assets/images/checkmark-white.svg',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.saveSelfAttendance(); },
    };
  }

  private applyFilter(): void {
    this.getAttendance();
  }

  private resetFilter(): void {
    this.filterForm.patchValue({
      memberId: 0,
      memberName: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      includeAllTeamMembers: false,
      todaysPendingAttendance: false
    });
    this.setTextBoxConfig();
    this.getAttendance();
  }

  private getReportingOfficer = async (isAllRO: boolean) => {
    this.service.GetReportingPerson(isAllRO, { search: "  " }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<DropdownValue[]>) => {
        if (res.isSuccess && res.data) {
          this.reportOfficeList = res.data;
          this.setTextBoxConfig();
          this.getAttendance();
        }
      }
    });
  };

  private getAttendance = () => {
    this.isLoading = true;
    const pastMemberId = window.history.state?.memberId || 0;
    const missingDate = window.history.state?.date || "";
    const pastMonth = moment(missingDate).month() + 1;
    const pastYear = moment(missingDate).year();
    // check if navigation history state has any memberId selected
    if (pastMemberId && missingDate) {
      const memberName = this.reportOfficeList.find((x) => x.id === pastMemberId)?.text;

      this.filterForm.patchValue({
        memberId: pastMemberId,
        memberName,
        month: pastMonth,
        year: pastYear
      });
    }

    window.history.replaceState({}, document.title, window.location.href);

    const data: IGetAttendanceModel = {
      memberId: pastMemberId || (this.filterForm.get('memberId')?.value || null),
      month: pastMonth || this.filterForm.get('month')?.value || 0,
      year: pastYear || this.filterForm.get('year')?.value || 0,
      includeAllTeamMembers: this.filterForm.get('includeAllTeamMembers')?.value,
      todaysPendingAttendance: this.filterForm.get('todaysPendingAttendance')?.value,
    };

    this.service.GetAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IAttendanceResponse>) => {
        if (res.isSuccess && res.data) {
          this.attendanceForm = this.fb?.group({});
          this.attendanceData = res.data.teamAttendance;
          this.attendanceDataDuplicate = JSON.parse(JSON.stringify(res.data?.teamAttendance));
          if (res.data?.reportingMembers && res.data?.reportingMembers?.length) {
            this.setReportingOfficerHierarchy(res.data?.reportingMembers);
          }
          else {
            this.historyArray = [];
          }
          this.getMonthYearLabel(res.data?.teamAttendance[0]?.teamMembers[0]?.attendance[0]?.attendanceDate);
          this.setDisplayColumns(res.data?.teamAttendance);
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
    const requestObject: ISaveAttendanceModel[] = this.getSaveAttendanceData();
    if (requestObject.length) {
      this.service.SaveAttendance(requestObject).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<void>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res?.message);
            this.getAttendance();
          }
        }
      });
    }
    else if (!this.checkAllControls()) {
      this.globalService.openSnackBar("No header checkbox selected.", "error-message");
    }
    else {
      this.globalService.openSnackBar("There are no unsaved changes for today.", "warning-message");
    }
  };
  // #endregion
}
