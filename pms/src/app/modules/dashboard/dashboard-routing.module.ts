import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Pages } from '../../common/constants/Enums';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { pageId: Pages.Dashboard, permission: [] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
