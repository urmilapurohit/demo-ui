import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';
import { AddManageComponent } from './components/add-manage/add.manage.component';
import { ManageComponent } from './components/manage/manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    data: { pageId: Pages.ManageRegularization, permission: [PageAccessTypes.View] },
},
{
    path: ROUTES.COMMON.EDIT,
    component: AddManageComponent,
    data: { pageId: Pages.ManageRegularization, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
