import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { ROUTES } from '@constants/routes';

const routes: Routes = [
  {
    path: ROUTES.RESOURCE_MANAGEMENT.MANAGE.MANAGE,
    loadChildren: () => import('./manage/manage.module').then((m) => m.ManageModule),
    data: { pageId: Pages.ResourceManagementManage, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.RESOURCE_MANAGEMENT.HIERARCHY.HIERARCHY,
    loadChildren: () => import('./hierarchy/hierarchy.module').then((m) => m.HierarchyModule),
    data: { pageId: Pages.ResourceManagementHierarchy, permission: [PageAccessTypes.View] }
  },
  { path: '', redirectTo: ROUTES.RESOURCE_MANAGEMENT.HIERARCHY.HIERARCHY, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceManagementRoutingModule { }
