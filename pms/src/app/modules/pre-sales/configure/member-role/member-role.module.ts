import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { MemberRoleRoutingModule } from './member-role-routing.module';
import { MemberRoleComponent } from './component/member-role/member.role.component';
import { CoreModule } from '../../../../common/common.module';
import { AddMemberRoleComponent } from './component/add-member-role/add.member.role.component';

@NgModule({
  declarations: [MemberRoleComponent, AddMemberRoleComponent],
  imports: [
    CommonModule,
    MemberRoleRoutingModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class MemberRoleModule { }
