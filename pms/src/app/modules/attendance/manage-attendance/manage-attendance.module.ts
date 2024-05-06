import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WorkspaceLibraryModule } from 'workspace-library';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ManageAttendanceRoutingModule } from './manage-attendance-routing.module';
import { CoreModule } from '../../../common/common.module';
import { ManageAttendanceComponent } from './components/manage-attendance/manage.attendance.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance.table.component';
import { MissingAttendanceComponent } from './components/missing-attendance/missing.attendance.component';

@NgModule({
  declarations: [ManageAttendanceComponent, AttendanceTableComponent, MissingAttendanceComponent],
  imports: [
    CommonModule,
    ManageAttendanceRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ScrollingModule,
    TableVirtualScrollModule
  ]
})
export class ManageAttendanceModule { }
