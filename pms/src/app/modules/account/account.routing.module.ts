import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '../../common/constants/routes';

const routes: Routes = [
  {
    path: ROUTES.ACCOUNT.USER.USER,
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: ROUTES.DASHBOARD.MEMBER_DASHBOARD_WIDGET.GET_MEMBER_DASHBOARD_WIDGET,
    loadChildren: () => import('./widget-settings/widget-setting.module').then((m) => m.WidgetSettingsModule),
  },
  { path: '', redirectTo: ROUTES.ACCOUNT.USER.USER, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
