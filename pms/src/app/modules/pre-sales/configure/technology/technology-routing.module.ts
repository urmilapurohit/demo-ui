import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { TechnologyComponent } from './components/technology/technology.component';
import { AddTechnologyComponent } from './components/add-technology/add.technology.component';

const routes: Routes = [
  {
    path: '',
    component: TechnologyComponent,
    data: { pageId: Pages.PreSalesTechnology, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddTechnologyComponent,
    data: { pageId: Pages.PreSalesTechnology, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddTechnologyComponent,
    data: { pageId: Pages.PreSalesTechnology, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnologyRoutingModule { }
