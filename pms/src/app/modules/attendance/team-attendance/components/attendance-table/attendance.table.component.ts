import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GLOBAL_CONSTANTS } from 'workspace-library';
import moment from 'moment';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ATTENDANCE_OPTIONS } from '@constants/constant';
import { IAttendanceData } from '../../models/team.attendance.model';

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance.table.component.html',
  styleUrl: './attendance.table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTableComponent {
  // #region class member
  @Input() displayedColumns!: string[];
  @Input() attendanceData !: IAttendanceData[];
  @Input() callback!: (memberId: number) => void;
  @Output() attendanceSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public viewPort!: CdkVirtualScrollViewport;
  memberCount = 0;
  attendanceOptions = ATTENDANCE_OPTIONS;
  // #endregion

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

  getDateFormat = (date: string): string => {
    return moment(date).format(GLOBAL_CONSTANTS.DATE_FORMATE.DD_MMM_YYYY);
  };

  onAttendanceSelect = (menuData: { memberId: number, date: string }, attendanceType: string) => {
    this.attendanceSelect.emit([menuData.memberId, attendanceType, menuData.date]);
  };

  isDisabled = (date: string, joinDate: string) => {
    if (date && joinDate && moment(date) < moment(joinDate)) {
      return true;
    }
    return false;
  };
  // #endregion
}
