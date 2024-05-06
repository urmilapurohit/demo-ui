import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { WorkspaceLibraryModule } from "workspace-library";
import { CoreModule } from "../../../../common/common.module";
import { AddSystemTypeComponent } from "./components/add-system-type/add.system.type.component";
import { SystemTypeComponent } from "./components/system-type/system.type.component";
import { SystemTypeRoutingModule } from "./system-type-routing.module";

@NgModule({
    declarations: [
        AddSystemTypeComponent,
        SystemTypeComponent
    ],
    imports: [
        CommonModule,
        SystemTypeRoutingModule,
        MatTableModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})

export class SystemTypeModule { }
