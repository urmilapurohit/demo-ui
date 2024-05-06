import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { CoreModule } from '../../../common/common.module';
import { DesignationWiseComponent } from './designation-wise/components/designation-wise/designation.wise.component';
import { MemberWiseComponent } from './member-wise/components/member-wise/member.wise.component';

@NgModule({
  declarations: [
    DesignationWiseComponent,
    MemberWiseComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class AuthorizationModule { }
