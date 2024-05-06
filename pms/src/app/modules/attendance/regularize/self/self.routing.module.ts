import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { AddSelfComponent } from './components/add-self/add.self.component';
import { SelfComponent } from './components/self/self.component';

const routes: Routes = [
  {
    path: '',
    component: SelfComponent,
    data: { pageId: Pages.SelfRegularization, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddSelfComponent,
    data: { pageId: Pages.SelfRegularization, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddSelfComponent,
    data: { pageId: Pages.SelfRegularization, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfRoutingModule { }
