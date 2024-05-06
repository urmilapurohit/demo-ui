import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { TechnologyComponent } from './components/technology/technology.component';
import { AddTechnologyComponent } from './components/add-technology/add.technology.component';
import { CoreModule } from '../../../../common/common.module';
import { TechnologyRoutingModule } from './technology-routing.module';

@NgModule({
  declarations: [
    TechnologyComponent,
    AddTechnologyComponent
  ],
  imports: [
    CommonModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule,
    CoreModule,
    TechnologyRoutingModule
  ]
})
export class TechnologyModule { }
