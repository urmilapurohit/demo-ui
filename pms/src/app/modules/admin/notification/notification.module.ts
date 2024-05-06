import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../common/common.module';
import { NotificationRoutingModule } from './notification-routing.module';
import { AddNotificationComponent } from './components/add.notification/add.notification.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    AddNotificationComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class NotificationModule { }
