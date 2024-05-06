import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { TeamComponent } from './components/team/team.component';
import { AddTeamComponent } from './components/add-team/add.team.component';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent,
    data: { pageId: Pages.TeamRegularization, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddTeamComponent,
    data: { pageId: Pages.TeamRegularization, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
