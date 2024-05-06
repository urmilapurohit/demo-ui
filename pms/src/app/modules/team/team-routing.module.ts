import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '../../common/constants/routes';
import { PageAccessTypes, Pages } from '../../common/constants/Enums';

const routes: Routes = [
  {
    path: ROUTES.TEAM.MANAGE.MANAGE,
    loadChildren: () => import('./manage/manage.module').then((m) => m.ManageModule),
    data: { pageId: Pages.TeamManage, permission: [PageAccessTypes.View] }
  },
  {
    path: ROUTES.TEAM.CONFIGURE.EFFICIENCY_REPORT.EFFICIENCY_REPORT,
    loadChildren: () => import('./configure/team-efficiency-report/team-efficiency-report.module').then((m) => m.TeamEfficiencyReportModule),
    data: { pageId: Pages.TeamEfficiencyReport, permission: [PageAccessTypes.View] }
  },
  { path: '', redirectTo: ROUTES.TEAM.MANAGE.MANAGE, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
