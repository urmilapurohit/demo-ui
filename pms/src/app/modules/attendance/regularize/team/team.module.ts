import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamRoutingModule } from './team.routing.module';
import { TeamComponent } from './components/team/team.component';
import { AddTeamComponent } from './components/add-team/add.team.component';
import { CoreModule } from '../../../../common/common.module';

@NgModule({
  declarations: [
    TeamComponent,
    AddTeamComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    WorkspaceLibraryModule,
    CoreModule,
    ReactiveFormsModule,
  ]
})
export class TeamModule { }
