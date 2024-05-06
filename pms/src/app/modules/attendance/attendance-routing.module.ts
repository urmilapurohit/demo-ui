import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.ATTENDANCE.SELF,
    pathMatch: 'full'
  },
  {
    path: ROUTES.ATTENDANCE.SELF,
    loadChildren: () => import('./self-attendance/self.attendance.module').then((m) => m.SelfAttendanceModule),
    data: { pageId: Pages.AttendanceSelf, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.TEAM.TEAM,
    loadChildren: () => import('./team-attendance/team-attendance.module').then((m) => m.TeamAttendanceModule),
    data: { pageId: Pages.AttendanceTeam, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.MANAGE.MANAGE,
    loadChildren: () => import('./manage-attendance/manage-attendance.module').then((m) => m.ManageAttendanceModule),
    data: { pageId: Pages.AttendanceManage, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.CORRECT,
    loadChildren: () => import('./correct/correct.module').then((m) => m.CorrectModule),
    data: { pageId: Pages.AttendanceCorrect, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.REGULARIZE.SELF.SELF,
    loadChildren: () => import('./regularize/self/self.module').then((m) => m.SelfModule),
    data: { pageId: Pages.SelfRegularization, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.REGULARIZE.MANAGE.MANAGE,
    loadChildren: () => import('./regularize/manage/manage.module').then((m) => m.ManageModule),
    data: { pageId: Pages.ManageRegularization, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.ATTENDANCE.REGULARIZE.TEAM.TEAM,
    loadChildren: () => import('./regularize/team/team.module').then((m) => m.TeamModule),
    data: { pageId: Pages.TeamRegularization, permission: [PageAccessTypes.View] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
