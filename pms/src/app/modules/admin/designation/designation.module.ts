import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WorkspaceLibraryModule } from "workspace-library";
import { ReactiveFormsModule } from "@angular/forms";
import { DesignationRoutingModule } from "./designation-routing.module";
import { AddDesignationComponent } from "./components/add-designation/add.designation.component";
import { DesignationComponent } from "./components/designation/designation.component";
import { CoreModule } from "../../../common/common.module";

@NgModule({
    declarations: [
        AddDesignationComponent,
        DesignationComponent
    ],
    imports: [
        CommonModule,
        DesignationRoutingModule,
        CoreModule,
        WorkspaceLibraryModule,
        ReactiveFormsModule
    ]
})
export class DesignationModule { }
