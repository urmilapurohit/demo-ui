import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { SystemStatusComponent } from "./components/system-status/system.status.component";
import { AddSystemStatusComponent } from "./components/add-system-status/add.system.status.component";
import { CoreModule } from "../../../../common/common.module";
import { SystemStatusRoutingModule } from "./system-status-routing.module";

@NgModule({
    declarations: [
        SystemStatusComponent,
        AddSystemStatusComponent
    ],
    imports: [
        CommonModule,
        SystemStatusRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class SystemStatusModule { }
