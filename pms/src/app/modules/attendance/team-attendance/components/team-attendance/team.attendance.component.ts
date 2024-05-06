/* eslint-disable no-restricted-syntax */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoComplete, BaseResponseModel, Button, ButtonType, ButtonVariant, Checkbox, DropDown, DropdownValue, GlobalService } from 'workspace-library';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { PermissionService } from '@services/permission.service';
import { Subject, takeUntil } from 'rxjs';
import { AttendanceTypeLabels } from '../../../attendance.config';
import { TeamAttendanceService } from '../../services/team.attendance.service';
import { IAttendanceData, IAttendanceResponse, IGetAttendanceModel, IParentHistory, IReportingMember, ISaveAttendanceModel } from '../../models/team.attendance.model';

@Component({
  selector: 'app-team-attendance',
  templateUrl: './team.attendance.component.html',
  styleUrl: './team.attendance.component.css',
})
export class TeamAttendanceComponent implements OnInit, OnDestroy {
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
  historyArray: IParentHistory[] = [];
  reportOfficeList: DropdownValue[] = [];
  AttendanceTypeLabels = AttendanceTypeLabels;
  pagePermissions: PageAccessPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(private uiService: UIService, private fb: FormBuilder, private service: TeamAttendanceService, private globalService: GlobalService, private router: Router, private permissionService: PermissionService) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AttendanceTeam);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setBreadcrumb();
    this.getReportingOfficer(false);
    this.setDropDownConfig();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setCheckBoxConfig();
    this.getAttendance();
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

  onPendingAttendanceClick() {
    this.router.navigate([ROUTES.ATTENDANCE.TEAM.TEAM_PENDING_ATTENDANCE_ABSOLUTE]);
  }

  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Attendance', link: '' },
      { label: 'Team', link: '' }
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
    const attendanceData = data[0]?.teamMembers[0]?.attendance?.map((x) => `${x.attendanceDate}_${x.nameOfDay}`);
    attendanceData?.unshift("name");
    this.displayedColumns = attendanceData;
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
            if (z.attendanceType && (!z.isSubmitted || (z.isSubmitted && z.attendanceType !== this.attendanceDataDuplicate[i1].teamMembers[i2].attendance[i3].attendanceType))) {
              data.push({
                attendanceType: z.attendanceType,
                memberId: y.memberId
              });
            }
          }
        });
      });
    });
    return data;
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

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      memberId: [""],
      memberName: [""],
      year: [new Date().getFullYear()],
      month: [new Date().getMonth() + 1],
      includeAllTeamMembers: [false],
      todaysPendingAttendance: [false]
    });

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

  private getReportingOfficer = (isAllRO: boolean,) => {
    this.service.GetReportingPerson(isAllRO, { search: "  " }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<DropdownValue[]>) => {
        if (res.isSuccess && res.data) {
          this.reportOfficeList = res.data;
          this.setTextBoxConfig();
        }
      }
    });
  };

  private getAttendance = () => {
    this.isLoading = true;

    const data: IGetAttendanceModel = {
      memberId: this.filterForm.get('memberId')?.value || null,
      month: this.filterForm.get('month')?.value || 0,
      year: this.filterForm.get('year')?.value || 0,
      includeAllTeamMembers: this.filterForm.get('includeAllTeamMembers')?.value,
      todaysPendingAttendance: this.filterForm.get('todaysPendingAttendance')?.value,
    };

    this.service.GetAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IAttendanceResponse>) => {
        if (res.isSuccess && res.data) {
          this.attendanceData = res.data?.teamAttendance;
          this.attendanceDataDuplicate = JSON.parse(JSON.stringify(res.data?.teamAttendance));
          if (res.data.reportingMembers && res.data?.reportingMembers?.length) {
            this.setReportingOfficerHierarchy(res.data.reportingMembers);
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
    else {
      this.globalService.openSnackBar("There are no unsaved changes for today.", "warning-message");
    }
  };
  // #endregion
}
