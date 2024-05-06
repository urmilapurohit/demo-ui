import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import moment from 'moment';
import { GLOBAL_CONSTANTS } from 'workspace-library';
import { ControlContainer, FormGroup } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { IAttendanceData } from '../../models/manage.attendance.model';

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance.table.component.html',
  styleUrl: './attendance.table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTableComponent implements OnInit {
  // #region class member
  @Input() editableColumns!: string[];
  @Input() displayedColumns!: string[];
  @Input() formGroup!: FormGroup;
  @Input() attendanceData !: IAttendanceData[];
  @Input() callback!: (memberId: number) => void;
  @Output() attendanceSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public viewPort!: CdkVirtualScrollViewport;
  memberCount = 0;
  attendanceOptions = ATTENDANCE_OPTIONS;
  today = moment(new Date()).format(GLOBAL_CONSTANTS.DATE_FORMATE.YYYY_MM_DD).toString();
  // #endregion

  constructor(private controlContainer: ControlContainer) { }

  get inverseOfTranslation(): string {
    if (!this.viewPort) {
      return '-0px';
    }
    const offset = this.viewPort.getOffsetToRenderedContentStart();
    if (offset) {
      return `-${offset + 1}px`;
    }
    return '-0px';
  }

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  // #region class methods
  getMemberCount = () => {
    let count = 0;
    this.attendanceData.forEach((x) => {
      count += x.teamMembers.length;
    });
    return count;
  };

  onParentClick = (memberId: number) => {
    this.callback(memberId);
  };

  onCheckBoxChange = (event: MatCheckboxChange, formControlName: string) => {
    if (event.checked) {
      // eslint-disable-next-line no-restricted-syntax
      for (const controlName in this.formGroup.controls) {
        if (controlName !== formControlName) {
          this.formGroup.get(controlName)?.patchValue(false);
        }
      }
    }
  };

  getDateFormat = (date: string): string => {
    return moment(date).format(GLOBAL_CONSTANTS.DATE_FORMATE.DD_MMM_YYYY);
  };

  onAttendanceSelect = (menuData: { memberId: number, date: string }, attendanceType: string) => {
    this.attendanceSelect.emit([menuData.memberId, attendanceType, menuData.date]);
  };

  isEditable = (col: string) => {
    if (this.editableColumns && col) {
      return this.editableColumns.includes(col?.split('_')?.[0]);
    }
    return false;
  };

  isDisabled = (date: string, joinDate: string) => {
    if (date && joinDate && moment(date) < moment(joinDate)) {
      return true;
    }
    return false;
  };
  // #endregion
}
