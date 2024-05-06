import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { ApplicationConfigurationRoutingModule } from "./application-configuration-routing.module";
import { CoreModule } from "../../../common/common.module";
import { ApplicationConfigurationComponent } from "./components/application-configuration/application.configuration.component";
import { AddApplicationConfigurationComponent } from './components/add.application.configuration/add.application.configuration.component';

@NgModule({
    declarations: [
        ApplicationConfigurationComponent,
        AddApplicationConfigurationComponent,
    ],
    imports: [
        CommonModule,
        ApplicationConfigurationRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class ApplicationConfigurationModule { }
