import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { PageAccessTypes, Pages } from '@constants/Enums';
import { NotificationTypeComponent } from './components/notification.type/notification.type.component';
import { AddNotificationTypeComponent } from './components/add.notification.type/add.notification.type.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationTypeComponent,
    data: { pageId: Pages.NotificationType, permission: [PageAccessTypes.View] },
  },
  {
    path: ROUTES.COMMON.ADD,
    component: AddNotificationTypeComponent,
    data: { pageId: Pages.NotificationType, permission: [PageAccessTypes.View, PageAccessTypes.Add] },
  },
  {
    path: ROUTES.COMMON.EDIT,
    component: AddNotificationTypeComponent,
    data: { pageId: Pages.NotificationType, permission: [PageAccessTypes.View, PageAccessTypes.Edit] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationTypeRoutingModule { }
