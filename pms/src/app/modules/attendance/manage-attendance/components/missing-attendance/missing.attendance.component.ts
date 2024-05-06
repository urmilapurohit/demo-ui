import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { BaseResponseModel, DateField } from 'workspace-library';
import { Router } from '@angular/router';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { DateFormats } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IGetPendingAttendanceRequest, IPendingAttendance } from '../../models/manage.attendance.model';
import { ManageAttendanceService } from '../../services/manage.attendance.service';

@Component({
  selector: 'app-missing-attendance',
  templateUrl: './missing.attendance.component.html',
  styleUrl: './missing.attendance.component.css'
})
export class MissingAttendanceComponent implements OnInit, OnDestroy {
  // #region class member
  @ViewChild(MatSort) sort!: MatSort;
  formGroup!: FormGroup;
  pendingAttendanceList: IPendingAttendance[] = [];
  isGridLoading: boolean = false;
  date!: DateField;
  displayedColumns: string[] = ['fullName', 'missingAttendanceCount'];
  dataSource!: any;
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: ManageAttendanceService,
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
      { label: 'Manage', link: ROUTES.ATTENDANCE.MANAGE.MANAGE_ABSOLUTE },
      { label: 'Missing Attendance', link: '' },
    ];
  }

  backToAttendance() {
    this.router.navigate([ROUTES.ATTENDANCE.MANAGE.MANAGE_ABSOLUTE]);
  }

  onNameClick = (memberId: number) => {
    window.history.replaceState({}, document.title, window.location.href);
    this.router.navigateByUrl(ROUTES.ATTENDANCE.MANAGE.MANAGE_ABSOLUTE, { state: { memberId, date: this.uiService.convertDateFormat(this.formGroup.controls['date']?.value, DateFormats.YYYY_MM_DD) } });
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
      sortDirection: "ascending",
      sortBy: "fullName"
    };

    this.service.GetMissingAttendance(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
