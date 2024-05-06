import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';

const routes: Routes = [
  {
    path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP,
    loadChildren: () => import('./configure/group/group.module').then((m) => m.GroupModule),
    data: { pageId: Pages.ProjectGroup, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS,
    loadChildren: () => import('./configure/status/status.module').then((m) => m.StatusModule),
    data: { pageId: Pages.ProjectStatus, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE,
    loadChildren: () => import('./configure/type/type.module').then((m) => m.TypeModule),
    data: { pageId: Pages.ProjectType, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE,
    loadChildren: () => import('./configure/project-role/project.role.module').then((m) => m.ProjectRoleModule),
    data: { pageId: Pages.ProjectRole, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE,
    loadChildren: () => import('./configure/sdlc-type/sdlc.type.module').then((m) => m.SdlcTypeModule),
    data: { pageId: Pages.ProjectSDLCType, permission: [PageAccessTypes.View] },
  },
  { path: '', redirectTo: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
