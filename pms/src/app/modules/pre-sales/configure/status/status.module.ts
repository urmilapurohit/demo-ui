import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusRoutingModule } from './status-routing.module';
import { CoreModule } from '../../../../common/common.module';
import { StatusComponent } from './components/status/status.component';
import { AddStatusComponent } from './components/add-status/add.status.component';

@NgModule({
  declarations: [
    StatusComponent,
    AddStatusComponent
  ],
  imports: [
    CommonModule,
    StatusRoutingModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class StatusModule { }
