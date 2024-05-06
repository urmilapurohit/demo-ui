import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';

const routes: Routes = [
  {
    path: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY,
    loadChildren: () => import('./configure/category/category.module').then((m) => m.CategoryModule),
    data: { pageId: Pages.HelpDeskCategory, permission: [PageAccessTypes.View] },
  },
  { path: '', redirectTo: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskRoutingModule { }
