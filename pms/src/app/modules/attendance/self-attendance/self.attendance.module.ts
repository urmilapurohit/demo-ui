import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { SelfAttendanceRoutingModule } from './self.attendance-routing.module';
import { CoreModule } from '../../../common/common.module';
import { SelfAttendanceComponent } from './components/my-attendance/self.attendance.component';

@NgModule({
  declarations: [
    SelfAttendanceComponent
  ],
  imports: [
    CommonModule,
    SelfAttendanceRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
  ]
})
export class SelfAttendanceModule { }
