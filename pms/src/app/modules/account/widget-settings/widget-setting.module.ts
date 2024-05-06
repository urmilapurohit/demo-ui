import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLibraryModule } from 'workspace-library';
import { ReactiveFormsModule } from '@angular/forms';
import { WidgetSettingsModuleRoutingModule } from './widget-setting-routing.module';
import { CoreModule } from '../../../common/common.module';
import { WidgetSettingsComponent } from './components/widget-settings/widget.settings.component';

@NgModule({
    declarations: [
        WidgetSettingsComponent
    ],
    imports: [
        CommonModule,
        WidgetSettingsModuleRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class WidgetSettingsModule { }
