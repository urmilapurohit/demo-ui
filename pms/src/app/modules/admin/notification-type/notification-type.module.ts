import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../../common/common.module';
import { NotificationTypeRoutingModule } from './notification-type-routing.module';
import { AddNotificationTypeComponent } from './components/add.notification.type/add.notification.type.component';
import { NotificationTypeComponent } from './components/notification.type/notification.type.component';

@NgModule({
  declarations: [
    AddNotificationTypeComponent,
    NotificationTypeComponent
  ],
  imports: [
    CommonModule,
    NotificationTypeRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class NotificationTypeModule { }
