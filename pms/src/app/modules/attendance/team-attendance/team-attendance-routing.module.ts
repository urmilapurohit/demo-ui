import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { TeamAttendanceComponent } from './components/team-attendance/team.attendance.component';
import { TeamPendingAttendanceComponent } from './components/team-pending-attendance/team.pending.attendance.component';

const routes: Routes = [
  {
    path: '',
    component: TeamAttendanceComponent,
    data: { pageId: Pages.AttendanceTeam, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.ATTENDANCE.TEAM.TEAM_PENDING_ATTENDANCE,
    component: TeamPendingAttendanceComponent,
    data: { pageId: Pages.AttendanceTeam, permission: [PageAccessTypes.View] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamAttendanceRoutingModule { }
