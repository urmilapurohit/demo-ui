import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { NotificationComponent } from './components/notification/notification.component';
import { AddNotificationComponent } from './components/add.notification/add.notification.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationComponent,
    data: { pageId: Pages.NotificationTypeDetail, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddNotificationComponent,
    data: { pageId: Pages.NotificationTypeDetail, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddNotificationComponent,
    data: { pageId: Pages.NotificationTypeDetail, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
