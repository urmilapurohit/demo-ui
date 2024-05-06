import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { StatusComponent } from "./components/status/status.component";
import { AddStatusComponent } from "./components/add-status/add.status.component";
import { StatusRoutingModule } from "./status-routing.module";

@NgModule({
    declarations: [
        StatusComponent,
        AddStatusComponent
    ],
    imports: [
        CommonModule,
        StatusRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class StatusModule { }
