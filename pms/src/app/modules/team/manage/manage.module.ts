import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { CoreModule } from '../../../common/common.module';
import { TeamManageListComponent } from './components/team-manage-list/team.manage.list.component';
import { TeamManageHierarchyComponent } from './components/team-manage-hierarchy/team.manage.hierarchy.component';

@NgModule({
  declarations: [
    ManageComponent,
    TeamManageListComponent,
    TeamManageHierarchyComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    CoreModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class ManageModule { }
