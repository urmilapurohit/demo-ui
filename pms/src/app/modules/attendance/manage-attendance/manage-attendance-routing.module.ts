import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { ManageAttendanceComponent } from './components/manage-attendance/manage.attendance.component';
import { MissingAttendanceComponent } from './components/missing-attendance/missing.attendance.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAttendanceComponent,
    data: { pageId: Pages.AttendanceManage, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ATTENDANCE.MANAGE.MANAGE_MISSING_ATTENDANCE,
    component: MissingAttendanceComponent,
    data: { pageId: Pages.AttendanceManage, permission: [PageAccessTypes.View] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAttendanceRoutingModule { }
