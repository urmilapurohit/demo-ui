import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceLibraryModule } from 'workspace-library';
import { SdlcAddComponent } from './components/sdlc-add/sdlc.add.component';
import { SdlcEditComponent } from './components/sdlc-edit/sdlc.edit.component';
import { SdlcStepEditComponent } from './components/sdlc-step-edit/sdlc.step.edit.component';
import { SdlcTypeEditComponent } from './components/sdlc-type-edit/sdlc.type.edit.component';
import { SdlcTypeComponent } from './components/sdlc-type/sdlc.type.component';
import { CoreModule } from '../../../../common/common.module';
import { SDLCTypeRoutingModule } from './sdlc.type.routing.module';

@NgModule({
  declarations: [
    SdlcAddComponent,
    SdlcEditComponent,
    SdlcStepEditComponent,
    SdlcTypeEditComponent,
    SdlcTypeComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SDLCTypeRoutingModule,
    WorkspaceLibraryModule,
    ReactiveFormsModule
  ]
})
export class SdlcTypeModule { }
