import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { HrRoutingModule } from './hr.routing.module';
import { CoreModule } from '../../common/common.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class HrModule { }
