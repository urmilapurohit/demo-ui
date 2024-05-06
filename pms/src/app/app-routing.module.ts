import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './common/components/layout/layout.component';
import { AuthGuard } from './common/guards/auth.guard';
import { pageaccessGuard } from './common/guards/pageaccess.guard';
import { UnauthorizedComponent } from './common/components/unauthorized/unauthorized.component';
import { COMMON_ROUTES, MODULES } from './common/constants/constant';
import { PagenotfoundComponent } from './common/components/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: MODULES.ADMIN,
        loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.DASHBOARD,
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.ATTENDANCE,
        loadChildren: () => import('./modules/attendance/attendance.module').then((m) => m.AttendanceModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.TEAM,
        loadChildren: () => import('./modules/team/team.module').then((m) => m.TeamModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.SITTING,
        loadChildren: () => import('./modules/sitting/sitting.module').then((m) => m.SittingModule)
      },
      {
        path: MODULES.PROJECT_MANAGEMENT,
        loadChildren: () => import('./modules/project-management/project-management.module').then((m) => m.ProjectManagementModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.PRE_SALES,
        loadChildren: () => import('./modules/pre-sales/presales.module').then((m) => m.PresalesModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.NETWORK,
        loadChildren: () => import('./modules/network/network.module').then((m) => m.NetworkModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.ACCOUNT,
        loadChildren: () => import('./modules/account/account.module').then((m) => m.AccountModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.DOCUMENTS,
        loadChildren: () => import('./modules/documents/documents.module').then((m) => m.DocumentsModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.HELP_DESK,
        loadChildren: () => import('./modules/help-desk/helpdesk.module').then((m) => m.HelpDeskModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: MODULES.RESOURCE_MANAGEMENT,
        loadChildren: () => import('./modules/resource-management/resource.management.module').then((m) => m.ResourceManagementModule),
        canActivateChild: [pageaccessGuard]
      },
      {
        path: COMMON_ROUTES.PAGE_NOT_FOUND, component: PagenotfoundComponent, pathMatch: 'full'
      },
      {
        path: COMMON_ROUTES.UNAUTHORIZED, component: UnauthorizedComponent, pathMatch: 'full'
      }
    ]
  },
  {
    path: '**', redirectTo: COMMON_ROUTES.PAGE_NOT_FOUND
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
