import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { SelfAttendanceComponent } from './components/my-attendance/self.attendance.component';

const routes: Routes = [
  {
    path: '',
    component: SelfAttendanceComponent,
    data: { pageId: Pages.AttendanceSelf, permission: [PageAccessTypes.View] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfAttendanceRoutingModule { }
