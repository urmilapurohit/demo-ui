import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { TeamAttendanceRoutingModule } from './team-attendance-routing.module';
import { CoreModule } from '../../../common/common.module';
import { TeamAttendanceComponent } from './components/team-attendance/team.attendance.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance.table.component';
import { TeamPendingAttendanceComponent } from './components/team-pending-attendance/team.pending.attendance.component';

@NgModule({
  declarations: [TeamAttendanceComponent, AttendanceTableComponent, TeamPendingAttendanceComponent],
  imports: [
    CommonModule,
    TeamAttendanceRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ScrollingModule,
    ReactiveFormsModule,
    TableVirtualScrollModule
  ]
})
export class TeamAttendanceModule { }
