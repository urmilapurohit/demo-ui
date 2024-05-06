import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, DateField } from 'workspace-library';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UIService } from '@services/ui.service';
import { DateFormats } from '@constants/Enums';
import { BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { TeamAttendanceService } from '../../services/team.attendance.service';
import { IGetPendingAttendanceRequest, IPendingAttendance } from '../../models/team.attendance.model';

@Component({
  selector: 'app-team-pending-attendance',
  templateUrl: './team.pending.attendance.component.html',
  styleUrl: './team.pending.attendance.component.css',
})
export class TeamPendingAttendanceComponent implements OnInit, OnDestroy {
  // #region class member
  @ViewChild(MatSort) sort!: MatSort;
  formGroup!: FormGroup;
  pendingAttendanceList: IPendingAttendance[] = [];
  isGridLoading: boolean = false;
  date!: DateField;
  displayedColumns: string[] = ['fullName', 'rOs'];
  dataSource!: any;
  sortDirection: string = "asc";
  sortBy: string = "ROs";
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: TeamAttendanceService,
    private uiService: UIService,
    private router: Router
  ) { }
  // #endregion

  ngOnInit() {
    this.initializeForm();
    this.setBreadcrumb();
    this.setDateConfig();
    this.getPendingAttendance();
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
      { label: 'Team', link: ROUTES.ATTENDANCE.TEAM.TEAM_ABSOLUTE },
      { label: 'Pending Attendance', link: '' },
    ];
  }

  backToAttendance() {
    this.router.navigate([ROUTES.ATTENDANCE.TEAM.TEAM_ABSOLUTE]);
  }

  onSortChange = (sortState: Sort) => {
    if (sortState.direction && sortState.active) {
      this.sortDirection = sortState.direction;
      this.sortBy = sortState.active;
    }
    this.getPendingAttendance();
  };

  private initializeForm(): void {
    this.formGroup = this.fb?.group({
      date: [new Date(), [Validators.required]],
    });
  }

  private setDateConfig(): void {
    this.date = {
      label: 'Date',
      formControlName: 'date',
      onChangeDate: () => { this.getPendingAttendance(); },
      onEnterPress: () => { this.getPendingAttendance(); },
      needOnKeyDown: true,
      min: () => { return new Date(new Date().getFullYear() - 3, 0, 1); },
      max: () => { return new Date(); },
    };
  }

  private getPendingAttendance(): void {
    this.isGridLoading = true;
    const data: IGetPendingAttendanceRequest = {
      attendanceDate: this.uiService.convertDateFormat(this.formGroup.controls['date']?.value, DateFormats.YYYY_MM_DD),
      sortDirection: this.sortDirection === "asc" ? GLOBAL_CONSTANTS.ASCENDING : GLOBAL_CONSTANTS.DESCENDING,
      sortBy: this.sortBy
    };

    this.service.GetPendingAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IPendingAttendance[]>) => {
        if (res.isSuccess && res.data) {
          this.pendingAttendanceList = res.data;
          this.dataSource = new TableVirtualScrollDataSource(res.data);
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
  // #endregion
}
