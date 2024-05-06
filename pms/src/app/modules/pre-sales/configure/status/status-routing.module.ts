import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { StatusComponent } from './components/status/status.component';
import { AddStatusComponent } from './components/add-status/add.status.component';

const routes: Routes = [
  {
    path: '',
    component: StatusComponent,
    data: { pageId: Pages.PreSalesStatus, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddStatusComponent,
    data: { pageId: Pages.PreSalesStatus, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddStatusComponent,
    data: { pageId: Pages.PreSalesStatus, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
